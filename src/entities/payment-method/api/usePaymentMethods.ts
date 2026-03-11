import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { createClient } from '@/shared/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import type { PaymentMethod } from '../model/payment.types'

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENT_METHODS.list(),
    queryFn: async (): Promise<PaymentMethod[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw new Error(error.message)
      return data as PaymentMethod[]
    },
  })
}
