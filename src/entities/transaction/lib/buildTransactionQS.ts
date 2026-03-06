import { TransactionListParams } from '@/entities/transaction/model/transaction.type'

export function buildTransactionQS(params: TransactionListParams & { cursor?: string }): string {
  const qs = new URLSearchParams()
  qs.set('sort', 'createdAt:desc')
  qs.set('limit', String(params.limit ?? 20))

  if (params.type) qs.set('type', params.type)
  if (params.categories?.length) qs.set('categories', params.categories.join(','))
  if (params.from) qs.set('from', `${params.from}T00:00:00+09:00`)
  if (params.to) qs.set('to', `${params.to}T23:59:59+09:00`)
  if (params.cursor) qs.set('cursor', params.cursor)
  if (params.includeSummary) qs.set('includeSummary', 'true')

  return qs.toString()
}
