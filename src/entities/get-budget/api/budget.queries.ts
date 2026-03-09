import { BudgetResponseSchema } from '@/entities/get-budget/model/budget.schema'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'

export function fetchBudget() {
  return Api.get('/dashboard/budgets', BudgetResponseSchema)
}

export function useBudgetQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.BUDGET.current(),
    queryFn: fetchBudget,
    staleTime: 60_000,
  })
}
