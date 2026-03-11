import {
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 월별 일간 수입/지출 추이 조회
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

  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount, created_at')
    .eq('user_id', user.id)
    .gte('created_at', rangeStart)
    .lt('created_at', rangeEnd)

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  // KST 기준 일별 집계
  const dayMap: Record<number, { income: number; expense: number }> = {}

  for (const tx of data ?? []) {
    const kstDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(tx.created_at))

    const day = Number(kstDateStr.split('-')[2])
    if (!dayMap[day]) dayMap[day] = { income: 0, expense: 0 }

    if (tx.type === 'IN') dayMap[day].income += Math.floor(tx.amount)
    else dayMap[day].expense += Math.floor(tx.amount)
  }

  // 월의 모든 날짜 채우기
  const [year, month] = monthFirstDay.split('-').map(Number)
  const totalDays = new Date(year, month, 0).getDate()

  const items = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1
    const date = new Date(year, month - 1, day)
    return {
      day,
      dayOfWeek: date.getDay(), // 0=일, 6=토
      income: dayMap[day]?.income ?? 0,
      expense: dayMap[day]?.expense ?? 0,
    }
  })

  return NextResponse.json({
    ok: true,
    data: {
      month: monthFirstDay,
      items,
    },
  })
}
