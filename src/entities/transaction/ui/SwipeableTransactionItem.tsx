'use client'

import { formatDate } from '@/entities/transaction/lib/formatDate'
import { useSwipeReveal } from '@/entities/transaction/lib/useSwipeReveal'
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

const ACTION_WIDTH = 144

type Props = {
  item: TTransactionItem
  onEdit: (item: TTransactionItem) => void
  onDelete: (id: number) => void
}

export function SwipeableTransactionItem({ item, onEdit, onDelete }: Props) {
  const { containerRef, offset, isDragging, close, handlers } = useSwipeReveal(ACTION_WIDTH)

  const isExpense = item.type === 'OUT'
  const categoryMap = isExpense
    ? { icon: EXPENSE_CATEGORY_ICON, label: EXPENSE_CATEGORY_LABEL, theme: EXPENSE_CATEGORY_THEME }
    : { icon: INCOME_CATEGORY_ICON, label: INCOME_CATEGORY_LABEL, theme: INCOME_CATEGORY_THEME }

  const Icon = categoryMap.icon[item.category as ExpenseCategory & IncomeCategory]
  const label = categoryMap.label[item.category as ExpenseCategory & IncomeCategory]
  const theme = categoryMap.theme[item.category as ExpenseCategory & IncomeCategory]

  return (
    <li ref={containerRef} className="relative overflow-hidden border-b last:border-b-0">
      {/* 오른쪽 액션 버튼 */}
      <div className="absolute right-0 top-0 bottom-0 flex" style={{ width: ACTION_WIDTH }}>
        <button
          type="button"
          onClick={() => { close(); onEdit(item) }}
          className="flex-1 flex items-center justify-center bg-[#8E8E93] text-white text-xs font-medium"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => { close(); onDelete(item.id) }}
          className="flex-1 flex items-center justify-center bg-[#FF3B30] text-white text-xs font-medium"
        >
          삭제
        </button>
      </div>

      {/* 메인 아이템 */}
      <div
        className="relative flex items-center gap-3 py-3 bg-card cursor-pointer select-none"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.25s ease',
        }}
        {...handlers}
      >
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg}`}>
          <Icon size={18} className={theme.icon} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-muted-foreground">{label} · {formatDate(item.createdAt)}</p>
        </div>

        <span className={`pr-1 text-sm font-semibold tabular-nums shrink-0 ${isExpense ? 'text-foreground' : 'text-primary'}`}>
          {isExpense ? '-' : '+'}{item.amount.toLocaleString('ko-KR')}원
        </span>
      </div>
    </li>
  )
}
