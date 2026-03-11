import { z } from 'zod'

export const PaymentMethodSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.enum(['card', 'account']),
  name: z.string(),
  last_four: z.string(),
  bank_name: z.string(),
  is_default: z.boolean(),
  created_at: z.string(),
})

export const PaymentMethodsSchema = z.array(PaymentMethodSchema)
