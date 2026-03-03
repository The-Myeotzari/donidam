import { TRANSACTION_CATEGORIES, TransactionCategory } from '@/shared/constants/transactionCategory'

// 요청 타입
export type CreateExpensePayload = {
  type: 'OUT'
  category: (typeof TRANSACTION_CATEGORIES)[number]
  amount: number
  isFixed: boolean
  createdAt?: string
  endDate?: string
}

// 폼 상태
export type FormState = {
  amount: string
  category: TransactionCategory | null
  description: string
  isFixed: boolean
  date: string
  endDate: string
}
