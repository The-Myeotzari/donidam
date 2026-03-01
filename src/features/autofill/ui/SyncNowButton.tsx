'use client'

import { Button } from '@/shared/ui/Button'
import { RefreshCwIcon } from 'lucide-react'

type Props = {
  accountId: string
  onSync: (accountId: string) => void
  isSyncing?: boolean
}

export function SyncNowButton({ accountId, onSync, isSyncing }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      leftIcon={<RefreshCwIcon className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />}
      onClick={() => onSync(accountId)}
      disabled={isSyncing}
    >
      지금 동기화
    </Button>
  )
}
