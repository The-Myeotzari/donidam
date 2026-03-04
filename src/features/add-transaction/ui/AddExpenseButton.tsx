'use client'

import { useAddExpenseMutation } from '@/features/add-transaction/api/addTransaction.mutation'
import { ADD_EXPENSE_FORM_ID, AddExpenseForm } from '@/features/add-transaction/ui/AddExpenseForm'
import { isApiRequestError } from '@/shared/lib/api/api'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

export function AddExpenseButton() {
  const [isOpen, setIsOpen] = useState(false)
  const mutation = useAddExpenseMutation()

  const handleClose = () => {
    if (mutation.isPending) return
    setIsOpen(false)
    mutation.reset()
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex-1 h-12 rounded-xl bg-card hover:bg-muted text-foreground card-shadow border-0 gap-1.5 px-3"
      >
        <Plus size={16} className="text-red-500" />
        <span className="text-sm">지출 추가</span>
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header>지출 추가</Modal.Header>

        <Modal.Content className="max-h-[65vh] overflow-y-auto">
          <AddExpenseForm
            onSubmitData={(payload) =>
              mutation.mutate(payload, {
                onSuccess: () => setIsOpen(false),
              })
            }
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
          <Button type="submit" form={ADD_EXPENSE_FORM_ID} size="md" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                추가 중...
              </>
            ) : (
              '추가하기'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
