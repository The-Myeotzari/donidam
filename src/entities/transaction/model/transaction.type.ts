import {
  TransactionItemSchema,
  TransactionsResponseSchema,
} from '@/entities/transaction/model/transaction.schema'
import { z } from 'zod'

export type TransactionItem = z.infer<typeof TransactionItemSchema>
export type TransactionsData = z.infer<typeof TransactionsResponseSchema>

// 공통 파라미터 타입
export type TransactionListParams = {
  type?: 'OUT' | 'IN'
  categories?: string[]
  from?: string // YYYY-MM-DD
  to?: string // YYYY-MM-DD
  limit?: number
  includeSummary?: boolean
}
