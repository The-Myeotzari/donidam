import type {
  CreateExpensePayload,
  CreateIncomePayload,
} from '@/features/add-transaction/model/addTransaction.type'
import { TransactionForm } from '@/features/add-transaction/ui/TransactionForm'

export const ADD_EXPENSE_FORM_ID = 'add-expense-form'

interface AddExpenseFormProps {
  onSubmitData: (payload: CreateExpensePayload) => void
  initialValues?: Parameters<typeof TransactionForm>[0]['initialValues']
  formKey?: string | number
}

export function AddExpenseForm({ onSubmitData, initialValues, formKey }: AddExpenseFormProps) {
  return (
    <TransactionForm
      key={formKey}
      type="expense"
      formId={ADD_EXPENSE_FORM_ID}
      onSubmitData={onSubmitData as (payload: CreateExpensePayload | CreateIncomePayload) => void}
      initialValues={initialValues}
    />
  )
}
