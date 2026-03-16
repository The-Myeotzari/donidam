import { z } from 'zod'
import { Api } from '@/shared/lib/api/api'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useQuery } from '@tanstack/react-query'

const ChildSummarySchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      totalAmount: z.number(),
      count: z.number(),
      childName: z.string(),
    }),
  })
  .transform((v) => v.data)

const ChildPromiseItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: z.string(),
  reward: z.number(),
  status: z.string(),
  dueDate: z.string().nullable(),
  message: z.string().nullable(),
  createdAt: z.string(),
})

const ChildPromisesSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({ items: z.array(ChildPromiseItemSchema) }),
  })
  .transform((v) => v.data)

const ChildAllowanceItemSchema = z.object({
  id: z.number(),
  senderId: z.string(),
  senderName: z.string(),
  amount: z.number(),
  message: z.string().nullable(),
  type: z.enum(['manual', 'reward']),
  createdAt: z.string(),
})

const ChildAllowancesSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({ items: z.array(ChildAllowanceItemSchema) }),
  })
  .transform((v) => v.data)

export type ChildPromiseItem = z.infer<typeof ChildPromiseItemSchema>
export type ChildAllowanceItem = z.infer<typeof ChildAllowanceItemSchema>

export function useChildSummaryQuery(month?: string) {
  const url = month
    ? `/deokdam/child/summary?month=${month}`
    : '/deokdam/child/summary'
  return useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.childSummary(month),
    queryFn: () => Api.get(url, ChildSummarySchema),
    staleTime: 1000 * 60,
  })
}

export function useChildPromisesQuery(status?: string) {
  const url = status && status !== 'ALL'
    ? `/deokdam/child/promises?status=${status}`
    : '/deokdam/child/promises'
  return useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.childPromises(status),
    queryFn: () => Api.get(url, ChildPromisesSchema),
    staleTime: 1000 * 30,
  })
}

export function useChildAllowancesQuery(type?: string) {
  const url = type && type !== 'all'
    ? `/deokdam/child/allowances?type=${type}`
    : '/deokdam/child/allowances'
  return useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.childAllowances(type),
    queryFn: () => Api.get(url, ChildAllowancesSchema),
    staleTime: 1000 * 30,
  })
}
