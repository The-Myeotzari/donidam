'use client'

import { queryClient as baseClient } from '@/app/_providers/QueryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => baseClient)

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
