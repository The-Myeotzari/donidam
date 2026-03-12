import type {
  CreateExpensePayload,
  CreateIncomePayload,
} from '@/features/add-transaction/model/addTransaction.type'
import { TransactionForm } from '@/features/add-transaction/ui/TransactionForm'

export const ADD_INCOME_FORM_ID = 'add-income-form'

interface AddIncomeFormProps {
  onSubmitData: (payload: CreateIncomePayload) => void
}

export function AddIncomeForm({ onSubmitData }: AddIncomeFormProps) {
  return (
    <TransactionForm
      type="income"
      formId={ADD_INCOME_FORM_ID}
      onSubmitData={onSubmitData as (payload: CreateExpensePayload | CreateIncomePayload) => void}
    />
  )
}
