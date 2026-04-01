import { z } from 'zod'

const PromiseStatusSchema = z.enum([
  'IN_PROGRESS',
  'PENDING_APPROVAL',
  'ACHIEVED',
  'APPROVED',
  'COMPLETED',
  'FAILED',
  'CANCELED',
])

const AllowanceTypeSchema = z.enum(['manual', 'reward'])

const PromiseItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: z.string(),
  childId: z.string(),
  childName: z.string(),
  reward: z.number(),
  status: PromiseStatusSchema,
  dueDate: z.string().nullable(),
  message: z.string().nullable(),
  createdAt: z.string(),
})

const AllowanceItemSchema = z.object({
  id: z.number(),
  senderId: z.string(),
  receiverId: z.string(),
  childName: z.string(),
  amount: z.number(),
  message: z.string().nullable(),
  type: AllowanceTypeSchema,
  createdAt: z.string(),
})

export const ParentSummarySchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      totalThisMonth: z.number(),
      totalPrevMonth: z.number(),
      changeAmount: z.number(),
      childCount: z.number(),
    }),
  })
  .transform((v) => v.data)

export const ParentPromisesSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      items: z.array(PromiseItemSchema),
    }),
  })
  .transform((v) => v.data)

export const ParentAllowancesSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      items: z.array(AllowanceItemSchema),
    }),
  })
  .transform((v) => v.data)

export const ConnectSchema = z.object({ ok: z.literal(true) })
export const ApproveSchema = z.object({ ok: z.literal(true) })
