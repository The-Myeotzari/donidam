import { Api } from '@/shared/lib/api/api'
import { z } from 'zod'

export async function deletePaymentMethod(id: string): Promise<void> {
  await Api.delete(`/payment-methods/${id}`, z.unknown())
}
