import { Card } from '@/shared/ui/Card'
import { ChangePasswordForm } from '@/features/change-password/ui/ChangePasswordForm'
import { KeyRound } from 'lucide-react'

export default function PasswordPage() {
  return (
    <div className="pt-2 pb-6 space-y-6">
      {/* 안내 카드 */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <KeyRound size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold">비밀번호 변경</p>
            <p className="text-xs text-muted-foreground">새로운 비밀번호를 설정하세요</p>
          </div>
        </div>

        <ChangePasswordForm />
      </Card>
    </div>
  )
}
