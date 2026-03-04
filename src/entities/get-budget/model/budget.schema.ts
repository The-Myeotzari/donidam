import { z } from 'zod'

export const BudgetResponseSchema = z.object({
  ok: z.literal(true),
  budgetData: z.object({
    targetAmount: z.number(),
  }),
})
