import type { ConnectedAccountDetail } from '../model/autofill.types'

type Props = {
  account: ConnectedAccountDetail
}

export function AccountBalanceCard({ account }: Props) {
  return (
    <div className="pb-4">
      <p className="text-sm text-muted-foreground">
        {account.bankName} {account.accountNumber}
      </p>
      <p className="mt-1 text-3xl font-bold">
        {account.balance.toLocaleString('ko-KR')}원
      </p>
    </div>
  )
}
