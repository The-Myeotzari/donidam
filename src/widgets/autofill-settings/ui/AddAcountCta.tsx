import { LockIcon, PlusIcon } from 'lucide-react'

const AVAILABLE_BANKS = [
  { id: 'hana', name: '하나은행', emoji: '🟢' },
  { id: 'woori', name: '우리은행', emoji: '💎' },
  { id: 'toss', name: '토스뱅크', emoji: '💙' },
  { id: 'kbank', name: '케이뱅크', emoji: '🟡' },
] as const

type Props = {
  onAddBank?: (bankId: string) => void
}

export function AddAccountCta({ onAddBank }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground px-1">계좌 추가하기</h2>

      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_BANKS.map((bank) => (
          <button
            key={bank.id}
            type="button"
            onClick={() => onAddBank?.(bank.id)}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card card-shadow hover:float-shadow hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-2xl">{bank.emoji}</span>
            <span className="text-sm font-medium text-foreground">{bank.name}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAddBank?.('more')}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
      >
        <PlusIcon className="size-4" />
        <span className="text-sm font-medium">다른 금융사 추가하기</span>
      </button>

      <p className="flex items-start gap-2 text-xs text-muted-foreground px-1 pb-2">
        <LockIcon className="size-3.5 mt-0.5 shrink-0" />
        돈이담은 금융보안원의 마이데이터 표준을 준수합니다. 귀하의 금융 정보는 암호화되어 안전하게 처리됩니다.
      </p>
    </div>
  )
}
