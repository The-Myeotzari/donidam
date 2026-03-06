import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/shared/constants/transactionCategory'
import { z } from 'zod'

export const TransactionItemSchema = z.object({
  id: z.number(),
  type: z.enum(['OUT', 'IN']),
  category: z.union([z.enum(EXPENSE_CATEGORIES), z.enum(INCOME_CATEGORIES)]),
  amount: z.number().int().min(0),
  isFixed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export const TransactionsResponseSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      items: z.array(TransactionItemSchema),
      page: z.object({
        nextCursor: z.string().nullable(),
        hasMore: z.boolean(),
      }),
    }),
  })
  .transform((v) => v.data)
