'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace('/auth')
          return
        }
      }

      router.replace('/')
    }

    run()
  }, [router])

  return <div className="min-h-screen flex items-center justify-center">로그인 처리중...</div>
}