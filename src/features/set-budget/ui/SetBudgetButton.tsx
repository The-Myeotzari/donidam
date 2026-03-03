'use client'

import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { Target } from 'lucide-react'
import { useState } from 'react'

export function SetBudgetButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex-1 h-12 rounded-xl bg-card hover:bg-muted text-foreground card-shadow border-0 gap-1.5 px-3"
      >
        <Target size={16} className="text-primary" />
        <span className="text-sm">이번달 예산</span>
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>이번달 예산 설정</Modal.Header>
        <Modal.Content>
          <div className="py-4 text-sm text-muted-foreground">
            {/* TODO: 예산 설정 폼 */}
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}
