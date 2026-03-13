'use client'

import { ROUTES } from '@/shared/constants/route'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { useRouter } from 'next/navigation'

interface NoPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NoPaymentMethodModal({ isOpen, onClose }: NoPaymentMethodModalProps) {
  const router = useRouter()

  const handleNavigate = () => {
    onClose()
    router.push(ROUTES.menuSettingsCard)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>결제 수단 없음</Modal.Header>
      <Modal.Content>
        <p className="text-sm text-muted-foreground">
          등록된 결제 수단이 없습니다.
          <br />
          거래 수단 이용을 위해 결제 수단을 먼저 등록해 주세요.
        </p>
      </Modal.Content>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleNavigate}>등록하러 가기</Button>
      </Modal.Footer>
    </Modal>
  )
}
