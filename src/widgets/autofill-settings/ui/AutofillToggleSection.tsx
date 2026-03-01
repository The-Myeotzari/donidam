'use client'

import { Card } from '@/shared/ui/Card'
import { ToggleAutofill } from '@/features/autofill/ui/ToggleAutofill'
import { RefreshCwIcon } from 'lucide-react'

type Props = {
  isEnabled: boolean
  onToggle: (checked: boolean) => void
}

export function AutofillToggleSection({ isEnabled, onToggle }: Props) {
  return (
    <Card>
      <Card.Content className="pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <RefreshCwIcon className="size-5  text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">자동 기입 활성화</p>
              <p className="text-xs text-muted-foreground mt-0.5">거래 내역을 자동으로 가져옵니다</p>
            </div>
          </div>
          <ToggleAutofill checked={isEnabled} onCheckedChange={onToggle} />
        </div>
      </Card.Content>
    </Card>
  )
}
