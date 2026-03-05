import {
  SpendingByCategoryItemSchema,
  SpendingByCategorySchema,
} from '@/entities/spending-by-category/model/spendingByCategory.schema'
import { z } from 'zod'

export type SpendingByCategoryItem = z.infer<typeof SpendingByCategoryItemSchema>
export type SpendingByCategoryData = z.infer<typeof SpendingByCategorySchema>
