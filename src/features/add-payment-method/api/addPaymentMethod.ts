import type { AddPaymentMethodInput } from '@/features/add-payment-method/model/payment.schema'
import { createClient } from '@/shared/lib/supabase/client'

export async function addPaymentMethod(
  input: AddPaymentMethodInput,
  isFirst: boolean,
): Promise<void> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  const { error } = await supabase.from('payment_methods').insert({
    user_id: user.id,
    type: input.type,
    name: input.name,
    last_four: input.lastFour,
    bank_name: input.bankName,
    is_default: isFirst,
  })

  if (error) throw new Error(error.message)
}
