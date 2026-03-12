'use client'

import { useDeleteTransactionMutation } from '@/features/delete-transaction/api/deleteTransaction.mutation'
import { isApiRequestError } from '@/shared/lib/api/api'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Loader2 } from 'lucide-react'

interface DeleteTransactionModalProps {
  transactionId: number | null
  onClose: () => void
}

export function DeleteTransactionModal({ transactionId, onClose }: DeleteTransactionModalProps) {
  const mutation = useDeleteTransactionMutation()

  const handleClose = () => {
    if (mutation.isPending) return
    onClose()
    mutation.reset()
  }

  const handleConfirm = () => {
    if (!transactionId) return
    mutation.mutate(transactionId, { onSuccess: handleClose })
  }

  return (
    <Modal isOpen={!!transactionId} onClose={handleClose}>
      <Modal.Header>거래 삭제</Modal.Header>
      <Modal.Content>
        <p className="text-sm text-muted-foreground">
          해당 거래 내역을 삭제하시겠습니까?
          <br />
          삭제한 내역은 복구할 수 없습니다.
        </p>
        {mutation.isError && (
          <p className="mt-2 text-sm text-destructive">
            {isApiRequestError(mutation.error)
              ? mutation.error.data.detail
              : '오류가 발생했습니다. 다시 시도해 주세요.'}
          </p>
        )}
      </Modal.Content>
      <Modal.Footer>
        <Button variant="outline" size="md" onClick={handleClose} disabled={mutation.isPending}>
          취소
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleConfirm}
          disabled={mutation.isPending}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              삭제 중...
            </>
          ) : (
            '삭제하기'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
