import {
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 부모 덕담 요약: 이번 달 총 용돈, 전월 비교, 자녀 수
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

  // 이전 달 범위
  const [y, m] = monthFirstDay.split('-').map(Number)
  const prevMonth = m === 1 ? 12 : m - 1
  const prevYear = m === 1 ? y - 1 : y
  const prevMonthFirstDay = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`
  const { rangeStart: prevStart, rangeEnd: prevEnd } = monthToKstRange(prevMonthFirstDay)

  // 이번 달 총 용돈
  const { data: thisMonthData, error: thisMonthError } = await supabase
    .from('allowances')
    .select('amount')
    .eq('sender_id', user.id)
    .gte('created_at', rangeStart)
    .lt('created_at', rangeEnd)

  if (thisMonthError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, thisMonthError.message)
  }

  // 지난 달 총 용돈
  const { data: prevMonthData, error: prevMonthError } = await supabase
    .from('allowances')
    .select('amount')
    .eq('sender_id', user.id)
    .gte('created_at', prevStart)
    .lt('created_at', prevEnd)

  if (prevMonthError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, prevMonthError.message)
  }

  // 자녀 수
  const { data: children, error: childrenError } = await supabase
    .from('family_relations')
    .select('child_id')
    .eq('parent_id', user.id)

  if (childrenError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, childrenError.message)
  }

  const totalThisMonth = (thisMonthData ?? []).reduce((sum, row) => sum + row.amount, 0)
  const totalPrevMonth = (prevMonthData ?? []).reduce((sum, row) => sum + row.amount, 0)

  return NextResponse.json({
    ok: true,
    data: {
      totalThisMonth,
      totalPrevMonth,
      changeAmount: totalThisMonth - totalPrevMonth,
      childCount: (children ?? []).length,
    },
  })
}
