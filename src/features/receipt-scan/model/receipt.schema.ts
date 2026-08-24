import { EXPENSE_CATEGORIES } from '@/shared/constants/transactionCategory'
import { z } from 'zod'

export const RECEIPT_FIELDS = ['amount', 'category', 'description', 'date'] as const

export const ReceiptFieldSchema = z.enum(RECEIPT_FIELDS)

const ReceiptAmountSchema = z.preprocess((value) => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return value

  const normalized = value.replace(/[^0-9.-]/g, '')
  return normalized ? Number(normalized) : value
}, z.number().finite().int().positive())

const ReceiptDescriptionSchema = z.string().trim().min(1).max(100)

const ReceiptDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
})

const ReceiptCategorySchema = z.enum(EXPENSE_CATEGORIES)

export const ReceiptDataSchema = z.object({
  amount: z.number().finite().int().positive().optional(),
  category: ReceiptCategorySchema,
  description: ReceiptDescriptionSchema,
  date: ReceiptDateSchema,
})

export const ReceiptParseResponseSchema = z.object({
  data: ReceiptDataSchema,
  needsReview: z.boolean(),
  reviewFields: z.array(ReceiptFieldSchema),
  fallbackFields: z.array(ReceiptFieldSchema),
})

export type ReceiptField = z.infer<typeof ReceiptFieldSchema>
export type ReceiptData = z.infer<typeof ReceiptDataSchema>
export type ReceiptParseResponse = z.infer<typeof ReceiptParseResponseSchema>

const FALLBACKS = {
  category: 'ETC',
  description: '영수증 지출',
} as const

/**
 * OCR 값은 필드별로 검증한다. 금액은 잘못 보정하면 실제 지출이 달라지므로
 * fallback을 두지 않고, 나머지 필드는 안전한 기본값을 사용한 뒤 확인받는다.
 */
export function validateReceiptValues(
  raw: unknown,
  today: string,
): ReceiptParseResponse {
  const source = typeof raw === 'object' && raw !== null
    ? raw as Record<string, unknown>
    : {}

  const amount = ReceiptAmountSchema.safeParse(source.amount)
  const category = ReceiptCategorySchema.safeParse(source.category)
  const description = ReceiptDescriptionSchema.safeParse(source.description)
  const date = ReceiptDateSchema.safeParse(source.date)

  const reviewFields: ReceiptField[] = []
  const fallbackFields: ReceiptField[] = []

  if (!amount.success) reviewFields.push('amount')

  if (!category.success) {
    reviewFields.push('category')
    fallbackFields.push('category')
  }

  if (!description.success) {
    reviewFields.push('description')
    fallbackFields.push('description')
  }

  if (!date.success) {
    reviewFields.push('date')
    fallbackFields.push('date')
  }

  return ReceiptParseResponseSchema.parse({
    data: {
      ...(amount.success ? { amount: amount.data } : {}),
      category: category.success ? category.data : FALLBACKS.category,
      description: description.success ? description.data : FALLBACKS.description,
      date: date.success ? date.data : today,
    },
    needsReview: reviewFields.length > 0,
    reviewFields,
    fallbackFields,
  })
}
