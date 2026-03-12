export type UpdateTransactionPayload = {
  id: number
  category?: string
  amount?: number
  isFixed?: boolean
  createdAt?: string
  endDate?: string | null
  paymentMethodId?: string | null
  description?: string | null
}
