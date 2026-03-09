import { BudgetResponseSchema } from '@/entities/get-budget/model/budget.schema'
import { z } from 'zod'

export type BudgetResponse = z.infer<typeof BudgetResponseSchema>
