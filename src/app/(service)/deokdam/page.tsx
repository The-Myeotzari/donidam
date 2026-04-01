'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Api } from '@/shared/lib/api/api'
import { ROUTES } from '@/shared/constants/route'
import { z } from 'zod'

const StatusSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({ role: z.enum(['parent', 'child', 'none']) }),
  })
  .transform((v) => v.data)

export default function DeokdamEntryPage() {
  const router = useRouter()

  const { data } = useQuery({
    queryKey: ['deokdam', 'status'],
    queryFn: () => Api.get('/deokdam/status', StatusSchema),
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (!data) return
    if (data.role === 'parent') router.replace(ROUTES.deokdamParentHome)
    else if (data.role === 'child') router.replace(ROUTES.deokdamChildHome)
    else router.replace(ROUTES.deokdamOnboarding)
  }, [data, router])

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-200px)]">
      <p className="text-sm text-muted-foreground">불러오는 중...</p>
    </div>
  )
}
