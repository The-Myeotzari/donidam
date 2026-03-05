import { MAIN_CARD_CODES } from '@/shared/constants/dashboardMainCard'
import { z } from 'zod'

const MainCardCodeEnumSchema = z.enum(MAIN_CARD_CODES as unknown as [string, ...string[]])

export const MainCardCodeSchema = z.union([
  MainCardCodeEnumSchema,
  z.literal('MAIN_CARD_NO_BUDGET'),
])

const MainCardVarsFullSchema = z
  .object({
    elapsedPercent: z.number().min(0).max(100),
    spendPercent: z.number().min(0), // 예산 초과 시 100+ 가능
    totalExpense: z.number().min(0),
    remainingAmount: z.number(), // 예산 초과면 음수 가능
    remainingDays: z.number().int().min(0).max(31),
    dailyRecommendedAmount: z.number(), // 상황에 따라 0/음수도 가능하니 number로
  })
  .passthrough()

const MainCardVarsEmptySchema = z.object({}).strict()

const MainCardProfileDataSchema = z
  .object({
    month: z.string(),
    code: MainCardCodeSchema,
    vars: z.union([MainCardVarsFullSchema, MainCardVarsEmptySchema]),
  })
  .superRefine((val, ctx) => {
    const isEmptyVars = Object.keys(val.vars).length === 0

    if (val.code === 'MAIN_CARD_NO_BUDGET' && !isEmptyVars) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MAIN_CARD_NO_BUDGET일 때 vars는 빈 객체여야 합니다.',
        path: ['vars'],
      })
    }

    if (val.code !== 'MAIN_CARD_NO_BUDGET' && isEmptyVars) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '예산이 설정된 메인 카드에서는 vars가 비어있으면 안 됩니다.',
        path: ['vars'],
      })
    }
  })

export const DashboardCardSchema = z
  .object({
    ok: z.literal(true),
    profileData: MainCardProfileDataSchema,
  })
  .passthrough()
  .transform((v) => v.profileData)
