import { Card } from '@/shared/ui/Card'
import { LockIcon, ShieldCheckIcon } from 'lucide-react'

export function SafeIntegrationCard() {
  return (
    <Card variant="secondary">
      <Card.Content className="pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="size-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">안전한 데이터 연동</p>
              <p className="text-sm text-white/80 mt-0.5">마이데이터 표준 API를 사용합니다</p>
            </div>
          </div>
          <LockIcon className="size-5 text-white/70 shrink-0" />
        </div>
      </Card.Content>
    </Card>
  )
}
