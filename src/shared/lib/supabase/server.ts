import type { Database } from '@/shared/types/database.types'
import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Component에서 쿠키 set이 막히는 경우가 있어 try/catch 처리
            // Proxy가 세션 갱신을 담당하면 여기서 실패해도 운영 가능
          }
        },
      },
    },
  )
}

// 도메인 주소 추가 필요
export async function getOrigin(): Promise<string> {
  const h = await headers()
  return h.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''
}
