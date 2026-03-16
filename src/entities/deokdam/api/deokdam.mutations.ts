import { ApproveSchema, ConnectSchema } from '@/entities/deokdam/model/deokdam.schema'
import { Api } from '@/shared/lib/api/api'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useQueryClient, useMutation } from '@tanstack/react-query'

export function useConnectChildMutation() {
  return useMutation({
    mutationFn: (childEmail: string) =>
      Api.post('/deokdam/onboarding/connect', ConnectSchema, { childEmail }),
  })
}

export function useApprovePromiseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (promiseId: number) =>
      Api.post(`/deokdam/parent/promises/${promiseId}/approve`, ApproveSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEOKDAM.all })
    },
  })
}
