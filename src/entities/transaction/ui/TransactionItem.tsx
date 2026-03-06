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

type Props = {
  item: TTransactionItem
}

export function TransactionItem({ item }: Props) {
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

  return (
    <li className="flex items-center gap-3 pb-3 border-b">
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
    </li>
  )
}
