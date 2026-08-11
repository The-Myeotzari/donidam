import type { TransactionsData } from '@/entities/transaction/model/transaction.type'
import type { Database } from '@/shared/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import 'server-only'

type ServerSupabaseClient = SupabaseClient<Database>

export async function getRecentTransactions(
  supabase: ServerSupabaseClient,
  userId: string,
  limit: number,
  ascending = false,
): Promise<TransactionsData> {
  const { data, error } = await supabase
    .from('transactions')
    .select(
      'id,type,category,amount,is_fixed,created_at,updated_at,end_date,description,payment_method_id',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending })
    .order('id', { ascending })
    .limit(limit + 1)

  if (error) throw new Error(error.message)

  const hasMore = data.length > limit
  const items = hasMore ? data.slice(0, limit) : data
  const lastItem = items[items.length - 1]

  const nextCursor =
    hasMore && lastItem
      ? Buffer.from(
          JSON.stringify({
            lastId: lastItem.id,
            lastCreatedAt: lastItem.created_at,
          }),
        ).toString('base64')
      : null

  return {
    items: items.map((row) => ({
      id: row.id,
      type: row.type,
      category: row.category,
      amount: row.amount,
      isFixed: row.is_fixed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      endDate: row.end_date,
      description: row.description,
      paymentMethodId: row.payment_method_id,
    })),
    page: {
      nextCursor,
      hasMore,
    },
  }
}
