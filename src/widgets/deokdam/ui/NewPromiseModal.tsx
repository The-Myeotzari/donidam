'use client'

import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useCreatePromiseMutation } from '@/entities/deokdam/api/deokdam.child.mutations'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function NewPromiseModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [reward, setReward] = useState(0)
  const [dueDate, setDueDate] = useState('')

  const { mutate: create, isPending } = useCreatePromiseMutation()

  const handleClose = () => {
    setTitle('')
    setReward(0)
    setDueDate('')
    onClose()
  }

  const handleSubmit = () => {
    if (!title.trim() || reward <= 0) return
    create(
      { title: title.trim(), reward, dueDate: dueDate || undefined },
      { onSuccess: handleClose },
    )
  }

  const canSubmit = title.trim().length > 0 && reward > 0

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header>새 약속 만들기</Modal.Header>
      <Modal.Content className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1.5">약속 내용</p>
          <Input>
            <Input.Field
              placeholder="예: 매일 독서 30분"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Input>
        </div>

        <div>
          <p className="text-sm font-medium mb-1.5">희망 보상금</p>
          <div className="flex items-center gap-2 rounded-3xl border bg-background px-4 py-2.5">
            <input
              type="text"
              inputMode="numeric"
              value={reward === 0 ? '' : reward.toLocaleString('ko-KR')}
              onChange={(e) => setReward(Number(e.target.value.replace(/[^0-9]/g, '')))}
              placeholder="0"
              className="flex-1 text-right text-base bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <span className="text-sm text-muted-foreground shrink-0">원</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1.5">기한 (선택)</p>
          <Input>
            <Input.Field
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Input>
        </div>
      </Modal.Content>

      <Modal.Footer className="px-6 pb-6 pt-0">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          disabled={!canSubmit}
          isLoading={isPending}
          onClick={handleSubmit}
        >
          약속 만들기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
