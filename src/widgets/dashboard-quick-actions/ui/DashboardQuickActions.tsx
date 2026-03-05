'use client'

import { AddExpenseButton } from '@/features/add-transaction/ui/AddExpenseButton'
import { AddIncomeButton } from '@/features/add-transaction/ui/AddIncomeButton'
import { SetBudgetButton } from '@/features/set-budget/ui/SetBudgetButton'

export function DashboardQuickActions() {
  return (
    <div className="flex gap-2 mt-6">
      <AddExpenseButton />
      <AddIncomeButton />
      <SetBudgetButton />
    </div>
  )
}
