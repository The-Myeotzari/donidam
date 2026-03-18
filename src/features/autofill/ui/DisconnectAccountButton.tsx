'use client'

import { Button } from '@/shared/ui/Button'

type Props = {
  accountId: string
  onDisconnect: (accountId: string) => void
}

export function DisconnectAccountButton({ accountId, onDisconnect }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={() => onDisconnect(accountId)}
    >
      연결 해제
    </Button>
  )
}
