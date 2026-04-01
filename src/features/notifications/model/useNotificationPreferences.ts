'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Api } from '@/shared/lib/api/api'

const PreferencesSchema = z.object({
  user_id: z.string(),
  push_enabled: z.boolean(),
  email_enabled: z.boolean(),
  budget_control_enabled: z.boolean(),
  stats_insight_enabled: z.boolean(),
  retention_enabled: z.boolean(),
  dukdam_enabled: z.boolean(),
  nodam_enabled: z.boolean(),
  notification_mode: z.enum(['nag', 'cheer', 'balanced']),
  created_at: z.string(),
  updated_at: z.string(),
})

export type NotificationPreferences = z.infer<typeof PreferencesSchema>

const QUERY_KEY = ['notification-preferences'] as const

export function useNotificationPreferences() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => Api.get('/notifications/preferences', PreferencesSchema),
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Omit<NotificationPreferences, 'user_id' | 'created_at' | 'updated_at'>>) =>
      Api.put('/notifications/preferences', z.unknown(), data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const prev = queryClient.getQueryData<NotificationPreferences>(QUERY_KEY)
      if (prev) {
        queryClient.setQueryData<NotificationPreferences>(QUERY_KEY, { ...prev, ...newData })
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
