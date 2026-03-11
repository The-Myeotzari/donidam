export type PaymentMethodType = 'card' | 'account'

export interface PaymentMethod {
  id: string
  user_id: string
  type: PaymentMethodType
  name: string
  last_four: string
  bank_name: string
  is_default: boolean
  created_at: string
}
