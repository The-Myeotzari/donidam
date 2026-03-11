import { createClient } from '@/shared/lib/supabase/client'

export async function deletePaymentMethod(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('payment_methods').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
