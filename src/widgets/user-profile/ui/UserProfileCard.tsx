import { Card } from '@/shared/ui/Card'
import { formatJoinDate } from '@/widgets/user-profile/lib/formatJoinDate'
import { User } from 'lucide-react'

type Props = {
  name: string
  email: string
  createdAt: string
}

export function UserProfileCard({ name, email, createdAt }: Props) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
          <User size={24} className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">가입일 {formatJoinDate(createdAt)}</p>
        </div>
      </div>
    </Card>
  )
}
