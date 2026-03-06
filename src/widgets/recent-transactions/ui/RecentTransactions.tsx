'use client'

import { useRecentTransactionsQuery } from '@/entities/transaction/api/transaction.queries'
import { TransactionItem } from '@/entities/transaction/ui/TransactionItem'
import { ROUTES } from '@/shared/constants/route'
import Link from 'next/link'

const RECENT_LIMIT = 5

type Props = {
  limit?: number
}

export function RecentTransactions({ limit = RECENT_LIMIT }: Props) {
  const { data } = useRecentTransactionsQuery(limit)

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
        <ul className="space-y-3">
          {data.items.map((item) => (
            <TransactionItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  )
}
