import type { UpdateTransactionPayload } from '@/features/edit-transaction/model/editTransaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

const UpdateTransactionResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({ id: z.number() }).passthrough(),
})

function updateTransaction({ id, ...payload }: UpdateTransactionPayload) {
  return Api.patch(`/dashboard/transactions/${id}`, UpdateTransactionResponseSchema, payload)
}

export function useEditTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.all })
    },
  })
}
