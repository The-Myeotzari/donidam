'use client'

import { formatDate } from '@/entities/transaction/lib/formatDate'
import type { TransactionItem as TTransactionItem } from '@/entities/transaction/model/transaction.type'
import {
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
  INCOME_CATEGORY_ICON,
  INCOME_CATEGORY_LABEL,
  INCOME_CATEGORY_THEME,
  type ExpenseCategory,
  type IncomeCategory,
} from '@/shared/constants/transactionCategory'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  item: TTransactionItem
  onEdit: (item: TTransactionItem) => void
  onDelete: (id: number) => void
}

export function SwipeableTransactionItem({ item, onEdit, onDelete }: Props) {
  const isExpense = item.type === 'OUT'

  const Icon = isExpense
    ? EXPENSE_CATEGORY_ICON[item.category as ExpenseCategory]
    : INCOME_CATEGORY_ICON[item.category as IncomeCategory]

  const label = isExpense
    ? EXPENSE_CATEGORY_LABEL[item.category as ExpenseCategory]
    : INCOME_CATEGORY_LABEL[item.category as IncomeCategory]

  const theme = isExpense
    ? EXPENSE_CATEGORY_THEME[item.category as ExpenseCategory]
    : INCOME_CATEGORY_THEME[item.category as IncomeCategory]

  const dateLabel = formatDate(item.createdAt)

  const [isActive, setIsActive] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isActive) return
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsActive(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isActive])

  return (
    <li ref={ref} className="border-b last:border-b-0 last:pb-0">
      <div
        className="flex items-center gap-3 py-3 cursor-pointer select-none"
        onClick={() => setIsActive((prev) => !prev)}
      >
        {/* 아이콘 */}
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg}`}>
          <Icon size={18} className={theme.icon} />
        </div>

        {/* 텍스트 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-muted-foreground">
            {label} · {dateLabel}
          </p>
        </div>

        {/* 금액 */}
        <span
          className={`text-sm font-semibold tabular-nums shrink-0 ${isExpense ? 'text-foreground' : 'text-primary'}`}
        >
          {isExpense ? '-' : '+'}
          {item.amount.toLocaleString('ko-KR')}원
        </span>
      </div>

      {/* 수정/삭제 버튼 */}
      {isActive && (
        <div className="flex gap-2 pb-3">
          <button
            type="button"
            onClick={() => { setIsActive(false); onEdit(item) }}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Pencil size={13} />
            수정
          </button>
          <button
            type="button"
            onClick={() => { setIsActive(false); onDelete(item.id) }}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={13} />
            삭제
          </button>
        </div>
      )}
    </li>
  )
}
