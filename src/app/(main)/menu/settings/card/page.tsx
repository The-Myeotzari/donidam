import { fetchPaymentMethods } from '@/entities/payment-method/api/fetchPaymentMethods.api'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { getCookies } from '@/shared/lib/api/getCookies'
import { CardSettingsWidget } from '@/widgets/payment-method-list/ui/CardSettingsWidget'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function CardPage() {
  const queryClient = new QueryClient()
  const cookie = await getCookies()

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.PAYMENT_METHODS.list(),
    queryFn: () => fetchPaymentMethods({ headers: { Cookie: cookie } }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CardSettingsWidget />
    </HydrationBoundary>
  )
}
