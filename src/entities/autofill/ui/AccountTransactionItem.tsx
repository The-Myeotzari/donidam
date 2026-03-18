import cn from '@/shared/lib/cn'
import type { AccountTransaction } from '../model/autofill.types'

type Props = {
  tx: AccountTransaction
  isManageMode: boolean
  isSelected: boolean
  onSelect: (id: string) => void
}

function formatAmount(amount: number) {
  const abs = Math.abs(amount).toLocaleString('ko-KR')
  return amount > 0 ? `+${abs}원` : `-${abs}원`
}

export function AccountTransactionItem({ tx, isManageMode, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={() => isManageMode && onSelect(tx.id)}
      className={cn(
        'flex w-full items-center justify-between py-3',
        isManageMode && 'gap-3',
      )}
    >
      {isManageMode && (
        <div
          className={cn(
            'size-5 shrink-0 rounded-full border-2 transition-colors',
            isSelected ? 'border-primary bg-primary' : 'border-border',
          )}
        />
      )}
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-foreground">{tx.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{tx.time}</p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            'text-sm font-medium',
            tx.amount > 0 ? 'text-emerald-500' : 'text-foreground',
          )}
        >
          {formatAmount(tx.amount)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {tx.balanceAfter.toLocaleString('ko-KR')}원
        </p>
      </div>
    </button>
  )
}
