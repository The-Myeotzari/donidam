'use client'

import { usePaymentMethods } from '@/entities/payment-method/api/usePaymentMethods'
import { AddPaymentMethodForm } from '@/features/add-payment-method/ui/AddPaymentMethodForm'
import { useDeletePaymentMethod } from '@/features/delete-payment-method/model/useDeletePaymentMethod'
import { useSetDefaultPaymentMethod } from '@/features/set-default-payment-method/model/useSetDefaultPaymentMethod'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Modal } from '@/shared/ui/Modal'
import { CreditCard, Plus } from 'lucide-react'
import { useState } from 'react'
import { PaymentMethodItem } from './PaymentMethodItem'

export function CardSettingsWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: methods = [], isLoading } = usePaymentMethods()
  const { mutate: deleteMutate, isPending: isDeleting } = useDeletePaymentMethod()
  const { mutate: setDefaultMutate, isPending: isSettingDefault } = useSetDefaultPaymentMethod()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* 결제 수단 목록 */}
        <Card>
          <Card.Content className="p-4">
            {methods.length > 0 ? (
              <div className="space-y-2">
                {methods.map((method) => (
                  <PaymentMethodItem
                    key={method.id}
                    method={method}
                    onDelete={(id) => deleteMutate(id)}
                    onSetDefault={(id) => setDefaultMutate(id)}
                    isDeleting={isDeleting}
                    isSettingDefault={isSettingDefault}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 gap-3 text-center">
                <CreditCard size={40} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">등록된 결제 수단이 없습니다</p>
                  <p className="text-xs text-muted-foreground mt-1">카드나 계좌를 추가해보세요</p>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* 추가 버튼 */}
        <Button fullWidth size="xl" className="rounded-xl gap-2" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          결제 수단 추가
        </Button>
      </div>

      {/* 추가 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>결제 수단 추가</Modal.Header>
        <Modal.Content>
          <AddPaymentMethodForm isFirst={methods.length === 0} onSuccess={() => setIsModalOpen(false)} />
        </Modal.Content>
      </Modal>
    </>
  )
}
