'use client'

import { ROUTES } from '@/shared/constants/route'
import { Api, isApiRequestError } from '@/shared/lib/api/api'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { useState } from 'react'
import { z } from 'zod'

export function WithdrawButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWithdraw = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await Api.delete('/auth/withdraw', z.unknown())

      const supabase = createClient()
      await supabase.auth.signOut()

      location.href = ROUTES.auth
    } catch (e) {
      const message = isApiRequestError(e) ? e.data.detail : '탈퇴 처리 중 오류가 발생했어요.'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          탈퇴하기
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)}>
        <Modal.Header>정말 탈퇴하시겠어요?</Modal.Header>
        <Modal.Content>
          <p className="text-sm text-muted-foreground">
            탈퇴하면 모든 데이터가 삭제되며 복구할 수 없어요.
          </p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </Modal.Content>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            취소
          </Button>
          <Button
            variant="secondary"
            onClick={handleWithdraw}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-(--destructive)/90"
          >
            {isLoading ? '처리 중...' : '탈퇴하기'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
