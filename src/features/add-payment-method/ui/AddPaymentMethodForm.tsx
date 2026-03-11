'use client'

import { BANKS, CARD_COMPANIES } from '@/shared/constants/financialInstitutions'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { useAddPaymentMethod } from '../model/useAddPaymentMethod'

interface AddPaymentMethodFormProps {
  isFirst: boolean
  onSuccess: () => void
}

export function AddPaymentMethodForm({ isFirst, onSuccess }: AddPaymentMethodFormProps) {
  const { type, setType, bankName, setBankName, name, setName, lastFour, setLastFour, errors, isPending, handleSubmit } =
    useAddPaymentMethod({ isFirst, onSuccess })

  const institutions = type === 'card' ? CARD_COMPANIES : BANKS

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 유형 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">유형</label>
        <SelectRoot
          value={type}
          onValueChange={(v) => {
            setType(v as 'card' | 'account')
            setBankName('')
          }}
          size="lg"
        >
          <SelectTrigger className="rounded-xl border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">카드</SelectItem>
            <SelectItem value="account">계좌</SelectItem>
          </SelectContent>
        </SelectRoot>
      </div>

      {/* 카드사 / 은행 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{type === 'card' ? '카드사' : '은행'}</label>
        <SelectRoot value={bankName} onValueChange={setBankName} size="lg" placeholder="선택하세요">
          <SelectTrigger className="rounded-xl border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        {errors.bankName && <p className="text-xs text-destructive px-1">{errors.bankName}</p>}
      </div>

      {/* 별칭 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">별칭</label>
        <Input variant={errors.name ? 'error' : 'default'} size="lg">
          <Input.Field
            placeholder="예: 월급 카드"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl"
          />
          {errors.name && <Input.Message>{errors.name}</Input.Message>}
        </Input>
      </div>

      {/* 뒷자리 4자리 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">뒷자리 4자리</label>
        <Input variant={errors.lastFour ? 'error' : 'default'} size="lg">
          <Input.Field
            placeholder="1234"
            inputMode="numeric"
            maxLength={4}
            value={lastFour}
            onChange={(e) => setLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="rounded-xl"
          />
          {errors.lastFour && <Input.Message>{errors.lastFour}</Input.Message>}
        </Input>
      </div>

      <Button type="submit" fullWidth size="xl" isLoading={isPending} loadingText="추가 중..." className="rounded-xl">
        추가하기
      </Button>
    </form>
  )
}
