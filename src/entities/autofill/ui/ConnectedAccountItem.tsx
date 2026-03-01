import { ChevronRightIcon } from 'lucide-react'
import type { ConnectedAccount } from '../model/autofill.types'
import { SyncStatusBadge } from './SyncStatusBadge'

const BANK_EMOJI: Record<string, string> = {
  kb: '🏦',
  kakao: '🐝',
  shinhan: '🔵',
  hana: '🟢',
  woori: '💎',
  nh: '🌾',
  ibk: '🏛️',
}

type Props = {
  account: ConnectedAccount
  onClick?: () => void
}

export function ConnectedAccountItem({ account, onClick }: Props) {
  const emoji = BANK_EMOJI[account.bankCode] ?? '🏦'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-5 bg-card rounded-2xl card-shadow hover:float-shadow hover:-translate-y-0.5 transition-all duration-200 text-left"
    >
      <div className="size-11 rounded-full bg-muted flex items-center justify-center shrink-0 text-xl">
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{account.bankName}</p>
        {account.lastSyncedAt && (
          <p className="text-xs text-muted-foreground mt-0.5">
            마지막 동기화: {account.lastSyncedAt}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <SyncStatusBadge status={account.status} />
        <ChevronRightIcon className="size-4 text-muted-foreground" />
      </div>
    </button>
  )
}
