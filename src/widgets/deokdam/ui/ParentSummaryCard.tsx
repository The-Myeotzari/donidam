'use client'

import { useParentSummaryQuery } from '@/entities/deokdam/api/deokdam.queries'

export function ParentSummaryCard() {
  const { data } = useParentSummaryQuery()

  const total = data?.totalThisMonth ?? 0
  const change = data?.changeAmount ?? 0
  const childCount = data?.childCount ?? 0

  const changeAbs = Math.abs(change)
  const changeLabel =
    change === 0
      ? '지난달과 동일'
      : change > 0
        ? `지난달 대비 ${changeAbs.toLocaleString('ko-KR')}원 증가`
        : `지난달 대비 ${changeAbs.toLocaleString('ko-KR')}원 감소`

  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      <p className="text-xs text-muted-foreground">이번 달 총 용돈</p>
      <p className="mt-1 text-3xl font-bold">{total.toLocaleString('ko-KR')}원</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{changeLabel}</p>
        {childCount > 0 && (
          <p className="text-xs text-muted-foreground">자녀 {childCount}명</p>
        )}
      </div>
    </div>
  )
}
