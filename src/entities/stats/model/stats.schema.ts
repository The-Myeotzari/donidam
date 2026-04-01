import { z } from 'zod'

export const StatsSummarySchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      month: z.string(),
      totalIncome: z.number(),
      totalExpense: z.number(),
      prevMonthExpense: z.number(),
      expenseChangePercent: z.number().nullable(),
    }),
  })
  .transform((v) => v.data)

export const DailyTrendItemSchema = z.object({
  day: z.number(),
  dayOfWeek: z.number(),
  income: z.number(),
  expense: z.number(),
})

export const DailyTrendSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      month: z.string(),
      items: z.array(DailyTrendItemSchema),
    }),
  })
  .transform((v) => v.data)
