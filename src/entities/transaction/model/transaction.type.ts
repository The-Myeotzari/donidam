import {
  TransactionItemSchema,
  TransactionsResponseSchema,
} from '@/entities/transaction/model/transaction.schema'
import { z } from 'zod'

export type TransactionItem = z.infer<typeof TransactionItemSchema>
export type TransactionsData = z.infer<typeof TransactionsResponseSchema>
