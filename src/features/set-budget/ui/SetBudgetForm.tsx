import cn from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Loader2 } from 'lucide-react'

const PRESETS = [
  { label: '100만원', value: '1000000' },
  { label: '150만원', value: '1500000' },
  { label: '200만원', value: '2000000' },
  { label: '300만원', value: '3000000' },
] as const

interface SetBudgetFormProps {
  amount: string
  onAmountChange: (value: string) => void
  isPending?: boolean
  onSubmit: () => void
}

export function SetBudgetForm({
  amount,
  onAmountChange,
  isPending = false,
  onSubmit,
}: SetBudgetFormProps) {
  const displayAmount = amount ? Number(amount).toLocaleString('ko-KR') : ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 안내 문구 */}
      <p className="text-sm text-muted-foreground">이번 달 지출 목표 금액을 설정하세요</p>

      {/* 금액 입력 */}
      <div className="relative flex items-end gap-2 border-b-2 border-input pb-3 focus-within:border-primary transition-colors">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={displayAmount}
          onChange={(e) => onAmountChange(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full bg-transparent text-right text-3xl font-bold focus:outline-none placeholder:text-muted-foreground/40"
        />
        <span className="shrink-0 text-xl font-semibold text-muted-foreground pb-0.5">원</span>
      </div>

      {/* 빠른 선택 */}
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onAmountChange(preset.value)}
            className={cn(
              'h-11 rounded-2xl border text-sm font-medium transition-colors',
              amount === preset.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-input text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 설정 완료 */}
      <Button
        type="submit"
        disabled={!amount || isPending}
        className="w-full h-12 rounded-2xl gradient-mint text-primary-foreground disabled:opacity-40 border-0"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            저장 중...
          </>
        ) : (
          '설정 완료'
        )}
      </Button>
    </form>
  )
}
