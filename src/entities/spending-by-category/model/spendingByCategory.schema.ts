import { EXPENSE_CATEGORIES } from '@/shared/constants/transactionCategory'
import { z } from 'zod'

export const SpendingByCategoryItemSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z.number().min(0),
  ratio: z.number().min(0),
})

export const SpendingByCategorySchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      month: z.string(),
      type: z.string(),
      items: z.array(SpendingByCategoryItemSchema),
    }),
  })
  .transform((v) => v.data)
