import type { PaymentMethod } from '@/entities/payment-method/model/payment.types'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

const PaymentMethodSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.enum(['card', 'account']),
  name: z.string(),
  last_four: z.string(),
  bank_name: z.string(),
  is_default: z.boolean(),
  created_at: z.string(),
})

const PaymentMethodsSchema = z.array(PaymentMethodSchema)

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENT_METHODS.list(),
    queryFn: (): Promise<PaymentMethod[]> => Api.get('/payment-methods', PaymentMethodsSchema),
  })
}
