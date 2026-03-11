import { Api } from '@/shared/lib/api/api'
import { z } from 'zod'

export async function setDefaultPaymentMethod(id: string): Promise<void> {
  await Api.patch(`/payment-methods/${id}`, z.unknown())
}
