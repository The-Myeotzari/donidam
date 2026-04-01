import { usePaymentMethods } from '@/entities/payment-method/api/usePaymentMethods'
import { NoPaymentMethodModal } from '@/entities/payment-method/ui/NoPaymentMethodModal'
import { toISODateTime } from '@/features/add-transaction/lib/toISODateTime'
import type {
  CreateExpensePayload,
  CreateIncomePayload,
} from '@/features/add-transaction/model/addTransaction.type'
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
  INCOME_CATEGORIES,
  INCOME_CATEGORY_ICON,
  INCOME_CATEGORY_LABEL,
  INCOME_CATEGORY_THEME,
} from '@/shared/constants/transactionCategory'
import cn from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select'
import { Toggle } from '@/shared/ui/Toggle'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

// 타입 정의
type TransactionFormType = 'expense' | 'income'

interface SharedFormState {
  amount: string
  category: string | null
  description: string
  isFixed: boolean
  date: string
  endDate: string
  paymentMethodId: string
}

interface TransactionFormConfig {
  txType: 'OUT' | 'IN'
  categories: readonly string[]
  categoryIcon: Record<string, LucideIcon>
  categoryLabel: Record<string, string>
  categoryTheme: Record<string, { bg: string; icon: string }>
  fixedLabel: string
  descriptionPlaceholder: string
}

// 설정
const FORM_CONFIG: Record<TransactionFormType, TransactionFormConfig> = {
  expense: {
    txType: 'OUT',
    categories: EXPENSE_CATEGORIES,
    categoryIcon: EXPENSE_CATEGORY_ICON,
    categoryLabel: EXPENSE_CATEGORY_LABEL,
    categoryTheme: EXPENSE_CATEGORY_THEME,
    fixedLabel: '고정지출',
    descriptionPlaceholder: '지출 내용을 입력해 주세요',
  },
  income: {
    txType: 'IN',
    categories: INCOME_CATEGORIES,
    categoryIcon: INCOME_CATEGORY_ICON,
    categoryLabel: INCOME_CATEGORY_LABEL,
    categoryTheme: INCOME_CATEGORY_THEME,
    fixedLabel: '고정수입',
    descriptionPlaceholder: '수입 내용을 입력해 주세요',
  },
}

const defaultForm = (): SharedFormState => ({
  amount: '',
  category: null,
  description: '',
  isFixed: false,
  date: new Date().toISOString().split('T')[0],
  endDate: '',
  paymentMethodId: '',
})

// 컴포넌트
interface TransactionFormProps {
  type: TransactionFormType
  formId: string
  onSubmitData: (payload: CreateExpensePayload | CreateIncomePayload) => void
  initialValues?: Partial<SharedFormState>
}

export function TransactionForm({ type, formId, onSubmitData, initialValues }: TransactionFormProps) {
  const [form, setForm] = useState<SharedFormState>(() => ({
    ...defaultForm(),
    ...initialValues,
  }))
  const [showNoPaymentModal, setShowNoPaymentModal] = useState(false)
  const { data: paymentMethods = [] } = usePaymentMethods()

  const config = FORM_CONFIG[type]

  const set = <K extends keyof SharedFormState>(key: K, value: SharedFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const displayAmount = form.amount ? Number(form.amount).toLocaleString('ko-KR') : ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category || !form.amount) return

    onSubmitData({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: config.txType as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: form.category as any,
      amount: Number(form.amount),
      isFixed: form.isFixed,
      createdAt: toISODateTime(form.date),
      endDate: form.isFixed && form.endDate ? toISODateTime(form.endDate) : undefined,
      paymentMethodId: form.paymentMethodId || undefined,
      description: form.description || undefined,
    })
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
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
          {config.categories.map((cat) => {
            const Icon = config.categoryIcon[cat]
            const theme = config.categoryTheme[cat]
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
                <span className="text-xs font-medium">{config.categoryLabel[cat]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 내용 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">내용</label>
        <textarea
          placeholder={config.descriptionPlaceholder}
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

      {/* 고정 여부 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{config.fixedLabel} 인가요?</span>
        <Toggle
          checked={form.isFixed}
          onCheckedChange={(v) => set('isFixed', v)}
          label={config.fixedLabel}
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

      {/* 종료일 - 고정일 때만 표시 */}
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

      {/* 거래 수단 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">거래 수단</label>
        {paymentMethods.length === 0 ? (
          <Button
            type="button"
            variant="outline"
            className="flex h-11 w-full items-center px-4"
            onClick={() => setShowNoPaymentModal(true)}
          >
            등록된 결제 수단이 없습니다
          </Button>
        ) : (
          <SelectRoot
            value={form.paymentMethodId}
            onValueChange={(v) => set('paymentMethodId', v)}
            placeholder="결제 수단을 선택해 주세요"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((pm) => (
                <SelectItem key={pm.id} value={pm.id}>
                  {`${pm.name} (${pm.bank_name} ****${pm.last_four})`}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      </div>

      <NoPaymentMethodModal
        isOpen={showNoPaymentModal}
        onClose={() => setShowNoPaymentModal(false)}
      />
    </form>
  )
}
