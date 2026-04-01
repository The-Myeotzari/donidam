'use client'

import type { PaymentMethod } from '@/entities/payment-method/model/payment.types'
import cn from '@/shared/lib/cn'
import { Building2, CreditCard, Star, Trash2 } from 'lucide-react'

interface PaymentMethodItemProps {
  method: PaymentMethod
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
  isDeleting: boolean
  isSettingDefault: boolean
}

export function PaymentMethodItem({
  method,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: PaymentMethodItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      {/* 타입 아이콘 */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          method.type === 'card' ? 'bg-primary/10' : 'bg-secondary/10',
        )}
      >
        {method.type === 'card' ? (
          <CreditCard size={20} className="text-primary" />
        ) : (
          <Building2 size={20} className="text-secondary" />
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-sm truncate">{method.name}</p>
          {method.is_default && (
            <Star size={13} className="text-yellow-500 fill-yellow-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {method.bank_name} •••• {method.last_four}
        </p>
      </div>

      {/* 액션 */}
      <div className="flex items-center gap-2 shrink-0">
        {!method.is_default && (
          <button
            type="button"
            onClick={() => onSetDefault(method.id)}
            disabled={isSettingDefault}
            className="text-xs text-primary font-medium disabled:opacity-50"
          >
            기본 설정
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(method.id)}
          disabled={isDeleting}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
