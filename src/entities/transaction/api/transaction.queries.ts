import { createClient } from '@/shared/lib/supabase/client'
import type { Transaction } from '../model/transaction.types'

export async function fetchTransactionsByMonth(month: Date): Promise<Transaction[]> {
  const supabase = createClient()

  const start = new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data ?? []
}