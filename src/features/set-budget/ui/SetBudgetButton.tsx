'use client'

import { useBudgetQuery } from '@/entities/get-budget/api/budget.queries'
import { useSetBudgetMutation } from '@/features/set-budget/api/budget.mutation'
import { SetBudgetForm } from '@/features/set-budget/ui/SetBudgetForm'
import { isApiRequestError } from '@/shared/lib/api/api'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Target } from 'lucide-react'
import { useState } from 'react'

export function SetBudgetButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')

  const { data: budgetData } = useBudgetQuery()
  const mutation = useSetBudgetMutation()

  const handleOpen = () => {
    const savedAmount = budgetData?.budgetData.targetAmount ?? 0
    setAmount(savedAmount > 0 ? String(savedAmount) : '')
    mutation.reset()
    setIsOpen(true)
  }

  const handleClose = () => {
    if (mutation.isPending) return
    setIsOpen(false)
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="flex-1 h-12 rounded-xl bg-card hover:bg-muted text-foreground card-shadow border-0 gap-1.5 px-3"
      >
        <Target size={16} className="text-primary" />
        <span className="text-sm">이번 달 예산</span>
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header>이번 달 예산 설정</Modal.Header>

        <Modal.Content>
          <SetBudgetForm
            amount={amount}
            onAmountChange={setAmount}
            isPending={mutation.isPending}
            onSubmit={() =>
              mutation.mutate(Number(amount), {
                onSuccess: () => setIsOpen(false),
              })
            }
          />
        </Modal.Content>

        {mutation.isError && (
          <Modal.Footer>
            <p className="text-sm text-destructive">
              {isApiRequestError(mutation.error)
                ? mutation.error.data.detail
                : '오류가 발생했습니다. 다시 시도해 주세요.'}
            </p>
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}
