'use client'

import { AddExpenseForm } from '@/features/add-expense/ui/AddExpenseForm'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Plus } from 'lucide-react'
import { useState } from 'react'

// 버튼
export function AddExpenseButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex-1 h-12 rounded-xl bg-card hover:bg-muted text-foreground card-shadow border-0 gap-1.5 px-3"
      >
        <Plus size={16} className="text-destructive" />
        <span className="text-sm">지출 추가</span>
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>지출 추가</Modal.Header>
        <Modal.Content className="max-h-[65vh] overflow-y-auto">
          <AddExpenseForm />
        </Modal.Content>
        <Modal.Footer>
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)}>
            취소
          </Button>
          <Button size="md">추가하기</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
