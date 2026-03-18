'use client'

import { useRecentTransactionsQuery } from '@/entities/transaction/api/transaction.queries'
import type { TransactionItem } from '@/entities/transaction/model/transaction.type'
import { SwipeableTransactionItem } from '@/entities/transaction/ui/SwipeableTransactionItem'
import { DeleteTransactionModal } from '@/features/delete-transaction/ui/DeleteTransactionModal'
import { EditTransactionModal } from '@/features/edit-transaction/ui/EditTransactionModal'
import { ROUTES } from '@/shared/constants/route'
import Link from 'next/link'
import { useState } from 'react'

const RECENT_LIMIT = 5

type Props = {
  limit?: number
}

export function RecentTransactions({ limit = RECENT_LIMIT }: Props) {
  const { data } = useRecentTransactionsQuery(limit)
  const [editItem, setEditItem] = useState<TransactionItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  if (!data) return null

  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">최근 거래</h3>
        <Link
          href={ROUTES.dashboardTransactions}
          className="text-xs text-muted-foreground flex items-center gap-0.5"
        >
          전체보기 <span aria-hidden>›</span>
        </Link>
      </div>

      {/* 리스트 */}
      {data.items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">거래 내역이 없습니다.</p>
      ) : (
        <ul>
          {data.items.map((item) => (
            <SwipeableTransactionItem
              key={item.id}
              item={item}
              onEdit={setEditItem}
              onDelete={setDeleteId}
            />
          ))}
        </ul>
      )}

      <EditTransactionModal item={editItem} onClose={() => setEditItem(null)} />
      <DeleteTransactionModal transactionId={deleteId} onClose={() => setDeleteId(null)} />
    </section>
  )
}
