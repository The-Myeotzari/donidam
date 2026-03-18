'use client'

import { useInfiniteTransactionsQuery } from '@/entities/transaction/api/transaction.queries'
import type { TransactionItem } from '@/entities/transaction/model/transaction.type'
import type { TransactionListParams } from '@/entities/transaction/model/transaction.type'
import { SwipeableTransactionItem } from '@/entities/transaction/ui/SwipeableTransactionItem'
import { DeleteTransactionModal } from '@/features/delete-transaction/ui/DeleteTransactionModal'
import { EditTransactionModal } from '@/features/edit-transaction/ui/EditTransactionModal'
import { ActiveFilterChips } from '@/features/transaction-filter/ui/ActiveFilterChips'
import { SummaryCards } from '@/widgets/transaction-list/ui/SummaryCards'
import { TypeTabs } from '@/widgets/transaction-list/ui/TypeTabs'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// 거래 목록
export function TransactionList() {
  const searchParams = useSearchParams()

  const typeParam = searchParams.get('type') ?? 'all'
  const categoriesParam = searchParams.get('categories') ?? ''
  const fromParam = searchParams.get('from') ?? ''
  const toParam = searchParams.get('to') ?? ''

  const queryParams: TransactionListParams = {
    type: typeParam === 'OUT' ? 'OUT' : typeParam === 'IN' ? 'IN' : undefined,
    categories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : undefined,
    from: fromParam || undefined,
    to: toParam || undefined,
    limit: 20,
    includeSummary: true,
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTransactionsQuery(queryParams)

  const [editItem, setEditItem] = useState<TransactionItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // 총 수입/지출 합산
  const allItems = data?.pages.flatMap((p) => p.items) ?? []
  const totalIncome = allItems.filter((t) => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = allItems
    .filter((t) => t.type === 'OUT')
    .reduce((sum, t) => sum + t.amount, 0)

  // 무한 스크롤
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div>
      {/* 요약 카드 */}
      <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />

      {/* 활성 필터 칩 */}
      <ActiveFilterChips />

      {/* 타입 탭 */}
      <TypeTabs />

      {/* 거래 리스트 */}
      <div className="bg-card rounded-2xl p-4 card-shadow">
        {isLoading ? (
          <ul className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 p-3 border-b">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              </li>
            ))}
          </ul>
        ) : allItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">거래 내역이 없습니다.</p>
        ) : (
          <ul>
            {allItems.map((item) => (
              <SwipeableTransactionItem
                key={item.id}
                item={item}
                onEdit={setEditItem}
                onDelete={setDeleteId}
              />
            ))}
          </ul>
        )}

        {/* 더 불러오기 트리거 */}
        <div ref={loadMoreRef} className="py-2">
          {isFetchingNextPage && (
            <p className="text-xs text-muted-foreground text-center py-2">불러오는 중…</p>
          )}
          {!hasNextPage && allItems.length > 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              모든 거래 내역을 불러왔습니다.
            </p>
          )}
        </div>
      </div>

      <EditTransactionModal item={editItem} onClose={() => setEditItem(null)} />
      <DeleteTransactionModal transactionId={deleteId} onClose={() => setDeleteId(null)} />
    </div>
  )
}
