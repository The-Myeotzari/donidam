import { BudgetResponseSchema } from '@/entities/get-budget/model/budget.schema'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function setBudget(targetAmount: number) {
  return Api.put('/dashboard/budgets', BudgetResponseSchema, { targetAmount })
}

export function useSetBudgetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BUDGET.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.all })
    },
  })
}
