import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type ExpenseCategory,
  type IncomeCategory,
} from '@/shared/constants/transactionCategory'

// ── 지출 요청 타입 ──────────────────────────────────────────────────────────────
export type CreateExpensePayload = {
  type: 'OUT'
  category: (typeof EXPENSE_CATEGORIES)[number]
  amount: number
  isFixed: boolean
  createdAt?: string
  endDate?: string
}

// ── 수입 요청 타입 ──────────────────────────────────────────────────────────────
export type CreateIncomePayload = {
  type: 'IN'
  category: (typeof INCOME_CATEGORIES)[number]
  amount: number
  isFixed: boolean
  createdAt?: string
  endDate?: string
}

// ── 지출 폼 상태 ────────────────────────────────────────────────────────────────
export type FormState = {
  amount: string
  category: ExpenseCategory | null
  description: string
  isFixed: boolean
  date: string
  endDate: string
}

// ── 수입 폼 상태 ────────────────────────────────────────────────────────────────
export type IncomeFormState = {
  amount: string
  category: IncomeCategory | null
  description: string
  isFixed: boolean
  date: string
  endDate: string
}
