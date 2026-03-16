import { PinLockScreen } from '@/features/verify-pin/ui/PinLockScreen'
import { createServer } from '@/shared/lib/supabase/server'
import { ROUTES } from '@/shared/constants/route'
import { redirect } from 'next/navigation'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('app_pin')
      .eq('id', user.id)
      .single()

    if (!profile?.app_pin) {
      redirect(ROUTES.setupPin)
    }
  }

  return <PinLockScreen>{children}</PinLockScreen>
}
