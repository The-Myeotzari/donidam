import { z } from 'zod'
import { DailyTrendItemSchema, DailyTrendSchema, StatsSummarySchema } from './stats.schema'

export type StatsSummary = z.infer<typeof StatsSummarySchema>
export type DailyTrendItem = z.infer<typeof DailyTrendItemSchema>
export type DailyTrend = z.infer<typeof DailyTrendSchema>
