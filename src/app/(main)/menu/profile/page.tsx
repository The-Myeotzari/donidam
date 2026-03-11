import { ROUTES } from '@/shared/constants/route'
import { createServer } from '@/shared/lib/supabase/server'
import { UserProfileCard } from '@/widgets/user-profile/ui/UserProfileCard'
import { WithdrawButton } from '@/widgets/user-profile/ui/WithdrawButton'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.auth)

  const name =
    user.user_metadata?.name ??
    user.user_metadata?.full_name ??
    user.email?.split('@')[0] ??
    '이름 없음'
  const email = user.email ?? ''
  const createdAt = user.created_at

  return (
    <div className="space-y-6 pt-2 pb-6">
      <UserProfileCard name={name} email={email} createdAt={createdAt} />
      <WithdrawButton />
    </div>
  )
}
