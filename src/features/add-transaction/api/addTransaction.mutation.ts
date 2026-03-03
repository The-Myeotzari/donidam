import { CreateExpenseResponseSchema } from '@/features/add-transaction/model/addTransaction.schema'
import { CreateExpensePayload } from '@/features/add-transaction/model/addTransaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// fetch 함수
function createExpense(payload: CreateExpensePayload) {
  return Api.post('/dashboard/transactions', CreateExpenseResponseSchema, payload)
}

// useMutation 훅
export function useAddExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.all })
    },
  })
}
