import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { getCookies } from '@/shared/lib/api/getCookies'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import { z } from 'zod'

// entities > 작업폴더명 > model > transaction.schema.ts
const TransactionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  amount: z.number(),
  category: z.enum([
    'FOOD',
    'CAFE',
    'TRANSPORT',
    'HOUSING',
    'SHOPPING',
    'MEDICAL',
    'EDUCATION',
    'LEISURE',
    'ETC',
  ]),
  type: z.enum(['IN', 'OUT']),
  is_fixed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  end_date: z.string().nullable(),
})

const TransactionsResponseSchema = z.object({
  ok: z.literal(true),
  transactions: z.array(TransactionSchema),
})

// entities > 작업폴더명 > action > transaction.action.ts
async function fetchTransactions() {
  const cookie = await getCookies()

  return Api.get('/mock', TransactionsResponseSchema, {
    cache: 'no-store',
    headers: { cookie },
  })
}

// 정적 데이터 일반 호출 방법
async function TransactionsData() {
  const data = await fetchTransactions()
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default async function Page() {
  // 서버 프리패칭: 서버 컴포넌트에서 선언 후 HydrationBoundary 사용
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.MOCK.mockList,
    queryFn: fetchTransactions,
  })

  return (
    <>
      <p>정적 데이터 일반 호출 방법</p>
      <Suspense fallback={<div>Loading transactions...</div>}>
        <TransactionsData />
      </Suspense>

      <p>서버에서 프리패칭은 주석 코드 참고</p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* 클라이언트 파일은 아래와 같음 */}
        {/* 
        use client'

        import { useQuery } from '@tanstack/react-query'
        import { fetchTransactions, transactionsKeys } from '@/entities/transactions/api'

        export default function TransactionsClient() {
          const { data, error, isLoading } = useQuery({
            queryKey: transactionsKeys.list(),
            queryFn: fetchTransactions,
          })

          if (isLoading) return <div>Loading...</div>
          if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>

          return <pre>{JSON.stringify(data, null, 2)}</pre>
        } 
         */}
      </HydrationBoundary>
    </>
  )
}
