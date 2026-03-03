import {
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 예산 및 총 지출 조회 (이번 달 지출 요약)
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)

  const resolved = resolveMonthFirstDay(url.searchParams.get('month'))
  if (!resolved.ok) {
    return apiError(request, 'INVALID_REQUEST', 400, resolved.detail)
  }
  const monthFirstDay = resolved.monthFirstDay

  // 월 범위 계산
  const { rangeStart, rangeEnd } = monthToKstRange(monthFirstDay)

  // 예산 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('monthly_budget')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, profileError.message)
  }

  const targetAmount = Math.floor(Number(profile.monthly_budget ?? 0))

  // 총지출 합계
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

  // 값 계산
  const remainingAmount = Math.floor(targetAmount - totalExpense)
  const spendPercent = targetAmount > 0 ? Math.floor((totalExpense / targetAmount) * 100) : 0

  return NextResponse.json({
    ok: true,
    data: {
      month: monthFirstDay,
      targetAmount,
      totalExpense,
      remainingAmount,
      spendPercent,
    },
  })
}
