import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePaymentMethod } from '../api/deletePaymentMethod'

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENT_METHODS.all })
    },
  })
}
