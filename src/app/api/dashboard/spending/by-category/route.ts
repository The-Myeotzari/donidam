import {
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import { TRANSACTION_CATEGORIES, TransactionCategory } from '@/shared/constants/transactionCategory'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 카테고리 별 이번 달 지출 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase } = auth
  const url = new URL(request.url)

  // month 처리
  const resolved = resolveMonthFirstDay(url.searchParams.get('month'))
  if (!resolved.ok) {
    return apiError(request, 'INVALID_REQUEST', 400, resolved.detail)
  }
  const monthFirstDay = resolved.monthFirstDay

  // type 처리
  const type = url.searchParams.get('type')
  if (!type) {
    return apiError(request, 'INVALID_REQUEST', 400, 'type은 OUT 또는 IN만 허용합니다.')
  }

  // 월 범위
  const { rangeStart, rangeEnd } = monthToKstRange(monthFirstDay)

  // 카테고리 별 지출 조회
  const { data, error } = await supabase.rpc('sum_monthly_amount_by_category_zeros', {
    categories: Array.from(TRANSACTION_CATEGORIES),
    range_start: rangeStart,
    range_end: rangeEnd,
    tx_type: 'OUT',
  })

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  // 전달할 데이터 정리
  const items: { category: TransactionCategory; amount: number; ratio: number }[] = []

  for (const row of (data ?? []) as { category: TransactionCategory; amount: number }[]) {
    const categoryStr = String(row.category) as TransactionCategory
    const amount = Math.floor(row.amount ?? 0)
    items.push({ category: categoryStr, amount, ratio: 0 })
  }

  // ratio 계산
  const total = items.reduce((sum, it) => sum + it.amount, 0)
  const itemsWithRatio = items.map((it) => ({
    ...it,
    ratio: total > 0 ? it.amount / total : 0,
  }))

  return NextResponse.json({
    ok: true,
    data: {
      month: monthFirstDay,
      type,
      items: itemsWithRatio,
    },
  })
}
