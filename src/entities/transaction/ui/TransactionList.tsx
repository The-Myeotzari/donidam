'use client'

import {
  Utensils,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Heart,
  BookOpen,
  Music,
  MoreHorizontal,
} from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import cn from '@/shared/lib/cn'
import { formatTime, formatAmount } from '../lib/format'
import type { Transaction, TransactionCategory } from '../model/transaction.types'

const CATEGORY_CONFIG: Record<
  TransactionCategory,
  { label: string; color: string; icon: React.ReactNode }
> = {
  FOOD: { label: '식비', color: '#f58e3d', icon: <Utensils size={16} /> },
  CAFE: { label: '카페', color: '#a07850', icon: <Coffee size={16} /> },
  TRANSPORT: { label: '교통', color: '#4fa9ea', icon: <Car size={16} /> },
  HOUSING: { label: '주거', color: '#8b7fb5', icon: <Home size={16} /> },
  SHOPPING: { label: '쇼핑', color: '#ec639b', icon: <ShoppingBag size={16} /> },
  MEDICAL: { label: '의료', color: '#36b86e', icon: <Heart size={16} /> },
  EDUCATION: { label: '교육', color: '#9d63e1', icon: <BookOpen size={16} /> },
  LEISURE: { label: '여가', color: '#f5c43f', icon: <Music size={16} /> },
  ETC: { label: '기타', color: '#837b6e', icon: <MoreHorizontal size={16} /> },
}

export { CATEGORY_CONFIG }

type Props = {
  transactions: Transaction[]
  isLoading: boolean
  isError: boolean
}

export function TransactionList({ transactions, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-destructive">데이터를 불러오는 데 실패했어요</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">이 날에는 거래 내역이 없어요</p>
      </div>
    )
  }

  return (
    <Card>
      <Card.Content className="p-0">
        <ul className="divide-y divide-border">
          {transactions.map((tx) => {
            const config = CATEGORY_CONFIG[tx.category]
            return (
              <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: config.color + '20', color: config.color }}
                >
                  {config.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(tx.created_at)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      tx.type === 'IN' ? 'text-secondary' : 'text-foreground',
                    )}
                  >
                    {tx.type === 'IN' ? '+' : '-'}
                    {formatAmount(tx.amount)}원
                  </p>
                  {tx.is_fixed && <span className="text-xs text-muted-foreground">고정</span>}
                </div>
              </li>
            )
          })}
        </ul>
      </Card.Content>
    </Card>
  )
}