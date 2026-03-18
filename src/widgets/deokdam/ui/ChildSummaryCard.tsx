'use client'

import { useChildSummaryQuery } from '@/entities/deokdam/api/deokdam.child.queries'

export function ChildSummaryCard() {
  const { data } = useChildSummaryQuery()

  const total = data?.totalAmount ?? 0
  const count = data?.count ?? 0
  const name = data?.childName ?? '나'

  return (
    <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
      <p className="text-xs text-muted-foreground">{name}의 용돈</p>
      <p className="mt-1 text-3xl font-bold">{total.toLocaleString('ko-KR')}원</p>
      <p className="mt-2 text-xs text-muted-foreground">이번 달 덕담 {count}건</p>
    </div>
  )
}
