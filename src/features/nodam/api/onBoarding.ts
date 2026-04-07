'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Api } from '@/shared/lib/api/api'

const QuitStartSchema = z.object({
  user_id: z.string(),
  start_date: z.string(),
  daily_smoke_cost: z.number(),
  daily_smoke_count: z.number(),
  created_at: z.string(),
})

export type QuitStart = z.infer<typeof QuitStartSchema>

const QUERY_KEY = ['quit-start'] as const

export function useQuitStart() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => Api.get('/quit/start', QuitStartSchema),
  })
}

export function useStartQuit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      dailySmokeCost?: number
      dailySmokeCount?: number
    }) =>
      Api.post('/nodam/onboarding', QuitStartSchema, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })

      const prev = queryClient.getQueryData<QuitStart>(QUERY_KEY)

      if (prev) {
        queryClient.setQueryData<QuitStart>(QUERY_KEY, {
          ...prev,
          start_date: new Date().toISOString(),
          daily_smoke_cost:
            newData.dailySmokeCost ?? prev.daily_smoke_cost,
          daily_smoke_count:
            newData.dailySmokeCount ?? prev.daily_smoke_count,
        })
      }

      return { prev }
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(QUERY_KEY, context.prev)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}