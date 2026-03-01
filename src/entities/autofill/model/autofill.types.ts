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
