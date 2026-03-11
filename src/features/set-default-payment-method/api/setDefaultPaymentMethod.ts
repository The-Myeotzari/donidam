import { createClient } from '@/shared/lib/supabase/client'

export async function setDefaultPaymentMethod(id: string): Promise<void> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  // 기존 기본 수단 해제 후 새로 지정
  await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', user.id)
  const { error } = await supabase.from('payment_methods').update({ is_default: true }).eq('id', id)
  if (error) throw new Error(error.message)
}
