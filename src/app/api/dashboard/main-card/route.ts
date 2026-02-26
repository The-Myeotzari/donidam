import {
  calcBudgetVars,
  calcElapsedAndRemainingByMonthKst,
  decideMainCardCode,
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import type { MAIN_CARD_CODES } from '@/shared/constants/dashboardMainCard'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

type MainCardCode = (typeof MAIN_CARD_CODES)[number]

// 메인 카드 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)

  const resolved = resolveMonthFirstDay(url.searchParams.get('month'))
  if (!resolved.ok) {
    return apiError(request, resolved.title, resolved.status, resolved.detail)
  }
  const monthFirstDay = resolved.monthFirstDay

  // 월 범위 + 경과율/남은 일수
  const { rangeStart, rangeEnd } = monthToKstRange(monthFirstDay)
  const { elapsedPercent, remainingDays } = calcElapsedAndRemainingByMonthKst(monthFirstDay)

  // 예산 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('monthly_budget')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, profileError.message)
  }

  const targetAmount = Math.floor(profile.monthly_budget ?? 0)

  if (targetAmount <= 0) {
    return NextResponse.json({
      ok: true,
      profileData: {
        month: monthFirstDay,
        code: 'MAIN_CARD_NO_BUDGET' as MainCardCode,
        vars: {},
      },
    })
  }

  // 해당 월 OUT 지출 합계
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('totalExpense:amount.sum()')
    .eq('user_id', user.id)
    .eq('type', 'OUT')
    .gte('created_at', rangeStart)
    .lt('created_at', rangeEnd)

  if (transactionsError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, transactionsError.message)
  }

  const totalExpense = Math.floor(Number(transactions?.[0]?.totalExpense ?? 0))

  // 지표 계산
  const { spendPercent, remainingAmount, dailyRecommendedAmount } = calcBudgetVars({
    targetAmount,
    totalExpense,
    remainingDays,
  })

  // code 결정
  const code = decideMainCardCode(targetAmount, elapsedPercent, spendPercent)

  return NextResponse.json({
    ok: true,
    profileData: {
      month: monthFirstDay,
      code,
      vars: {
        elapsedPercent,
        spendPercent,
        remainingAmount,
        remainingDays,
        dailyRecommendedAmount,
      },
    },
  })
}
