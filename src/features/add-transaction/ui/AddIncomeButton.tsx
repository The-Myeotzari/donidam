'use client'

import { AddIncomeForm } from '@/features/add-transaction/ui/AddIncomeForm'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { TrendingUp } from 'lucide-react'
import { useState } from 'react'

export function AddIncomeButton() {
  const [isOpen, setIsOpen] = useState(false)

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
          <AddIncomeForm />
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
