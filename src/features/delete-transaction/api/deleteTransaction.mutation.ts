import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

function deleteTransaction(id: number): Promise<void> {
  return Api.delete(`/dashboard/transactions/${id}`, z.unknown()) as Promise<void>
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.all })
    },
  })
}
