import { CreateExpenseResponseSchema } from '@/features/add-transaction/model/addTransaction.schema'
import type {
  CreateExpensePayload,
  CreateIncomePayload,
} from '@/features/add-transaction/model/addTransaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// ── fetch 함수 (지출·수입 공통) ────────────────────────────────────────────────
function createTransaction(payload: CreateExpensePayload | CreateIncomePayload) {
  return Api.post('/dashboard/transactions', CreateExpenseResponseSchema, payload)
}

// ── 공통 훅 팩토리 ─────────────────────────────────────────────────────────────
function useAddTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.all })
    },
  })
}

// ── 지출 추가 훅 ───────────────────────────────────────────────────────────────
export const useAddExpenseMutation = useAddTransactionMutation

// ── 수입 추가 훅 ───────────────────────────────────────────────────────────────
export const useAddIncomeMutation = useAddTransactionMutation
