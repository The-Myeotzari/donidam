import type { Tables } from '@/shared/types/database.types'

export type Transaction = Tables<'transactions'>
export type TransactionCategory = Transaction['category']