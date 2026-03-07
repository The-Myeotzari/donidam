import {
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 월별 수입/지출 요약 조회
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
  const { rangeStart, rangeEnd } = monthToKstRange(monthFirstDay)

  // 지난달 범위
  const prevDate = new Date(monthFirstDay)
  prevDate.setMonth(prevDate.getMonth() - 1)
  const prevMonthFirstDay = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-01`
  const { rangeStart: prevStart, rangeEnd: prevEnd } = monthToKstRange(prevMonthFirstDay)

  // 이번 달 수입
  const { data: incomeData, error: incomeError } = await supabase
    .from('transactions')
    .select('total:amount.sum()')
    .eq('user_id', user.id)
    .eq('type', 'IN')
    .gte('created_at', rangeStart)
    .lt('created_at', rangeEnd)

  if (incomeError) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, incomeError.message)

  // 이번 달 지출
  const { data: expenseData, error: expenseError } = await supabase
    .from('transactions')
    .select('total:amount.sum()')
    .eq('user_id', user.id)
    .eq('type', 'OUT')
    .gte('created_at', rangeStart)
    .lt('created_at', rangeEnd)

  if (expenseError) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, expenseError.message)

  // 지난달 지출
  const { data: prevExpenseData, error: prevExpenseError } = await supabase
    .from('transactions')
    .select('total:amount.sum()')
    .eq('user_id', user.id)
    .eq('type', 'OUT')
    .gte('created_at', prevStart)
    .lt('created_at', prevEnd)

  if (prevExpenseError)
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, prevExpenseError.message)

  const totalIncome = Math.floor(Number(incomeData?.[0]?.total ?? 0))
  const totalExpense = Math.floor(Number(expenseData?.[0]?.total ?? 0))
  const prevMonthExpense = Math.floor(Number(prevExpenseData?.[0]?.total ?? 0))

  const expenseChangePercent =
    prevMonthExpense > 0
      ? Math.round(((totalExpense - prevMonthExpense) / prevMonthExpense) * 1000) / 10
      : null

  return NextResponse.json({
    ok: true,
    data: {
      month: monthFirstDay,
      totalIncome,
      totalExpense,
      prevMonthExpense,
      expenseChangePercent,
    },
  })
}
