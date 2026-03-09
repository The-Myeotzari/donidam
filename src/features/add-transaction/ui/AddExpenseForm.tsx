import { toISODateTime } from '@/features/add-transaction/lib/toISODateTime'
import type {
  CreateExpensePayload,
  FormState,
} from '@/features/add-transaction/model/addTransaction.type'
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
} from '@/shared/constants/transactionCategory'
import cn from '@/shared/lib/cn'
import { Input } from '@/shared/ui/Input'
import { Toggle } from '@/shared/ui/Toggle'
import { useState } from 'react'

export const ADD_EXPENSE_FORM_ID = 'add-expense-form'

const initialForm = (): FormState => ({
  amount: '',
  category: null,
  description: '',
  isFixed: false,
  date: new Date().toISOString().split('T')[0],
  endDate: '',
})

// Props
interface AddExpenseFormProps {
  onSubmitData: (payload: CreateExpensePayload) => void
}

// 폼 컴포넌트
export function AddExpenseForm({ onSubmitData }: AddExpenseFormProps) {
  const [form, setForm] = useState<FormState>(initialForm)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const displayAmount = form.amount ? Number(form.amount).toLocaleString('ko-KR') : ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category || !form.amount) return

    onSubmitData({
      type: 'OUT',
      category: form.category,
      amount: Number(form.amount),
      isFixed: form.isFixed,
      createdAt: toISODateTime(form.date),
      endDate: form.isFixed && form.endDate ? toISODateTime(form.endDate) : undefined,
    })
  }

  return (
    <form id={ADD_EXPENSE_FORM_ID} onSubmit={handleSubmit} className="space-y-5">
      {/* 금액 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          금액 <span className="text-destructive">*</span>
        </label>
        <Input size="lg">
          <Input.Field
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={displayAmount}
            onChange={(e) => set('amount', e.target.value.replace(/[^0-9]/g, ''))}
          />
          <Input.Icon>
            <span className="text-sm text-muted-foreground">원</span>
          </Input.Icon>
        </Input>
      </div>

      {/* 카테고리 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          카테고리 <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {EXPENSE_CATEGORIES.map((cat) => {
            const Icon = EXPENSE_CATEGORY_ICON[cat]
            const theme = EXPENSE_CATEGORY_THEME[cat]
            const isSelected = form.category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => set('category', cat)}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border transition-colors',
                  isSelected
                    ? cn('border-primary', theme.bg)
                    : 'border-transparent bg-muted/50 hover:border-primary/30',
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center',
                    isSelected ? 'bg-white/60' : theme.bg,
                  )}
                >
                  <Icon size={22} className={theme.icon} />
                </div>
                <span className="text-xs font-medium">{EXPENSE_CATEGORY_LABEL[cat]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 내용 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">내용</label>
        <textarea
          placeholder="지출 내용을 입력해 주세요"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className={cn(
            'w-full rounded-3xl border border-input bg-background px-3 py-2.5 text-base',
            'placeholder:text-muted-foreground resize-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
        />
      </div>

      {/* 고정지출 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">고정지출 인가요?</span>
        <Toggle
          checked={form.isFixed}
          onCheckedChange={(v) => set('isFixed', v)}
          label="고정지출"
          labelable={false}
        />
      </div>

      {/* 날짜 / 시작일 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{form.isFixed ? '시작일' : '날짜'}</label>
        <Input>
          <Input.Field
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </Input>
      </div>

      {/* 종료일 - 고정지출일 때만 표시 */}
      {form.isFixed && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">종료일</label>
          <Input>
            <Input.Field
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </Input>
        </div>
      )}

      {/* 거래 계좌 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium flex items-center gap-1.5">
          거래 계좌
          <span className="text-xs text-muted-foreground font-normal">(추후 분리 예정)</span>
        </label>
        <Input>
          <Input.Field placeholder="계좌를 선택해 주세요" disabled />
        </Input>
      </div>
    </form>
  )
}
