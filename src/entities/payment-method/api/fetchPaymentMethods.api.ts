import { Api } from '@/shared/lib/api/api'
import { PaymentMethodsSchema } from '../model/payment.schema'
import type { PaymentMethod } from '../model/payment.types'

export async function fetchPaymentMethods(options?: RequestInit): Promise<PaymentMethod[]> {
  return Api.get('/payment-methods', PaymentMethodsSchema, options)
}
