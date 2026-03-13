'use client'

import { useEditTransactionMutation } from '@/features/edit-transaction/api/editTransaction.mutation'
import { TransactionForm } from '@/features/add-transaction/ui/TransactionForm'
import type { TransactionItem } from '@/entities/transaction/model/transaction.type'
import { isApiRequestError } from '@/shared/lib/api/api'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Loader2 } from 'lucide-react'

const EDIT_TRANSACTION_FORM_ID = 'edit-transaction-form'

interface EditTransactionModalProps {
  item: TransactionItem | null
  onClose: () => void
}

export function EditTransactionModal({ item, onClose }: EditTransactionModalProps) {
  const mutation = useEditTransactionMutation()

  const handleClose = () => {
    if (mutation.isPending) return
    onClose()
    mutation.reset()
  }

  if (!item) return null

  const type = item.type === 'OUT' ? 'expense' : 'income'

  const initialValues = {
    amount: String(item.amount),
    category: item.category,
    description: item.description ?? '',
    isFixed: item.isFixed,
    date: item.createdAt.split('T')[0],
    endDate: item.endDate ? item.endDate.split('T')[0] : '',
    paymentMethodId: item.paymentMethodId ?? '',
  }

  return (
    <Modal isOpen={!!item} onClose={handleClose}>
      <Modal.Header>{type === 'expense' ? '지출 수정' : '수입 수정'}</Modal.Header>

      <Modal.Content className="max-h-[65vh] overflow-y-auto pt-4">
        <TransactionForm
          type={type}
          formId={EDIT_TRANSACTION_FORM_ID}
          initialValues={initialValues}
          onSubmitData={(payload) => {
            mutation.mutate(
              {
                id: item.id,
                category: payload.category,
                amount: payload.amount,
                isFixed: payload.isFixed,
                createdAt: payload.createdAt,
                endDate: payload.endDate ?? null,
                paymentMethodId: payload.paymentMethodId ?? null,
                description: payload.description ?? null,
              },
              { onSuccess: handleClose },
            )
          }}
        />
      </Modal.Content>

      <Modal.Footer>
        {mutation.isError && (
          <p className="flex-1 text-sm text-destructive">
            {isApiRequestError(mutation.error)
              ? mutation.error.data.detail
              : '오류가 발생했습니다. 다시 시도해 주세요.'}
          </p>
        )}
        <Button variant="outline" size="md" onClick={handleClose} disabled={mutation.isPending}>
          취소
        </Button>
        <Button
          type="submit"
          form={EDIT_TRANSACTION_FORM_ID}
          size="md"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              수정 중...
            </>
          ) : (
            '수정하기'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
