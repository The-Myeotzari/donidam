import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setDefaultPaymentMethod } from '../api/setDefaultPaymentMethod'

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => setDefaultPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENT_METHODS.all })
    },
  })
}
