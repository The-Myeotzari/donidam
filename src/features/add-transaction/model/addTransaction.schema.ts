import { EXPENSE_CATEGORIES } from '@/shared/constants/ExpenseCategory'
import { z } from 'zod'

// 응답 스키마
export const CreateExpenseResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    id: z.number(),
    type: z.enum(['OUT', 'IN']),
    category: z.enum(EXPENSE_CATEGORIES),
    amount: z.number(),
    isFixed: z.boolean(),
    createdAt: z.string(),
    end_date: z.string().nullable(),
  }),
})
