'use client'

import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: async () => 'react-query-ok',
  })

  return <div>{data}</div>
}
