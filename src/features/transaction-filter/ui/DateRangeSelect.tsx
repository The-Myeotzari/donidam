'use client'

import cn from '@/shared/lib/cn'
import { CalendarDays } from 'lucide-react'
import { useRef } from 'react'

// "YYYY-MM-DD" → "YYYY. M. D."
function formatDisplay(dateStr: string): string {
  if (!dateStr) return '선택'
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${y}. ${m}. ${d}.`
}

type DateInputProps = {
  label: string
  value: string
  max?: string
  min?: string
  onChange: (value: string) => void
}

function DateInput({ label, value, min, max, onChange }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        className={cn(
          'relative w-full flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-background text-sm text-left transition-colors',
          value && 'border-primary',
        )}
      >
        <CalendarDays size={15} className={value ? 'text-primary' : 'text-muted-foreground'} />
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {formatDisplay(value)}
        </span>
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          tabIndex={-1}
        />
      </button>
    </div>
  )
}

type Props = {
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export function DateRangeSelect({ from, to, onFromChange, onToChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3">기간</p>
      <div className="grid grid-cols-2 gap-3">
        <DateInput label="시작일" value={from} max={to || undefined} onChange={onFromChange} />
        <DateInput label="종료일" value={to} min={from || undefined} onChange={onToChange} />
      </div>
    </div>
  )
}
