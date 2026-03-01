'use client'

import { Toggle } from '@/shared/ui/Toggle'

type Props = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleAutofill({ checked, onCheckedChange, disabled }: Props) {
  return (
    <Toggle checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} label="자동 기입 활성화">
      <Toggle.Track>
        <Toggle.Thumb />
      </Toggle.Track>
    </Toggle>
  )
}
