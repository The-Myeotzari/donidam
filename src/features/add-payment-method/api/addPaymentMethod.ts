import type { AddPaymentMethodInput } from '@/features/add-payment-method/model/payment.schema'
import { Api } from '@/shared/lib/api/api'
import { z } from 'zod'

export async function addPaymentMethod(
  input: AddPaymentMethodInput,
  isFirst: boolean,
): Promise<void> {
  await Api.post('/payment-methods', z.unknown(), {
    type: input.type,
    bankName: input.bankName,
    name: input.name,
    lastFour: input.lastFour,
    isFirst,
  })
}
