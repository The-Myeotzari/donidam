export type SyncStatus = 'connected' | 'syncing' | 'error'

export type ConnectedAccount = {
  id: string
  bankName: string
  bankCode: string
  lastSyncedAt?: string
  status: SyncStatus
}

export type AutofillSettings = {
  isEnabled: boolean
  connectedAccounts: ConnectedAccount[]
}

export type AccountTransaction = {
  id: string
  name: string
  time: string
  amount: number
  balanceAfter: number
  date: string // 'YYYY-MM-DD'
}

export type ConnectedAccountDetail = {
  bankName: string
  accountNumber: string
  balance: number
}
