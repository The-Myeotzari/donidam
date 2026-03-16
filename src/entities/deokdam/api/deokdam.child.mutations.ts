import { z } from 'zod'
import { Api } from '@/shared/lib/api/api'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const OkSchema = z.object({ ok: z.literal(true) })
const CreatePromiseSchema = z
  .object({ ok: z.literal(true), data: z.object({ id: z.number() }) })

export function useChildAcceptMutation() {
  return useMutation({
    mutationFn: (parentEmail: string) =>
      Api.post('/deokdam/onboarding/child-accept', OkSchema, { parentEmail }),
  })
}

export function useCreatePromiseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { title: string; reward: number; dueDate?: string; category?: string }) =>
      Api.post('/deokdam/child/promises', CreatePromiseSchema, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEOKDAM.childPromises() })
    },
  })
}

export function useCompletePromiseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (promiseId: number) =>
      Api.patch(`/deokdam/child/promises/${promiseId}/complete`, OkSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEOKDAM.childPromises() })
    },
  })
}
