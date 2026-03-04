'use client'

import { useAddExpenseMutation } from '@/features/add-transaction/api/addTransaction.mutation'
import { ADD_INCOME_FORM_ID, AddIncomeForm } from '@/features/add-transaction/ui/AddIncomeForm'
import { isApiRequestError } from '@/shared/lib/api/api'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Loader2, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export function AddIncomeButton() {
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
        className="flex-1 h-12 rounded-xl gradient-mint text-primary-foreground border-0 gap-1.5 px-3"
      >
        <TrendingUp size={16} />
        <span className="text-sm">수입 추가</span>
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>수입 추가</Modal.Header>

        <Modal.Content className="max-h-[65vh] overflow-y-auto">
          <AddIncomeForm
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
          <Button type="submit" form={ADD_INCOME_FORM_ID} size="md" disabled={mutation.isPending}>
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
