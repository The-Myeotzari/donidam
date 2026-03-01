import { ConnectedAccountItem } from '@/entities/autofill/ui/ConnectedAccountItem'
import type { ConnectedAccount } from '@/entities/autofill/model/autofill.types'

type Props = {
  accounts: ConnectedAccount[]
  onAccountClick?: (accountId: string) => void
}

export function ConnectedAccountsSection({ accounts, onAccountClick }: Props) {
  if (accounts.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-3 px-1">연결된 계좌</h2>
      <div className="flex flex-col gap-3">
        {accounts.map((account) => (
          <ConnectedAccountItem
            key={account.id}
            account={account}
            onClick={() => onAccountClick?.(account.id)}
          />
        ))}
      </div>
    </div>
  )
}
