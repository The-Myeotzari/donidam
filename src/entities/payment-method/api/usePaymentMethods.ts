import { PaymentMethodsSchema } from '@/entities/payment-method/model/payment.schema'
import type { PaymentMethod } from '@/entities/payment-method/model/payment.types'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENT_METHODS.list(),
    queryFn: (): Promise<PaymentMethod[]> => Api.get('/payment-methods', PaymentMethodsSchema),
  })
}
