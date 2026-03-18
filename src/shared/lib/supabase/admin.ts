import type { Database } from '@/shared/types/database.types'
import { createClient } from '@supabase/supabase-js'

/**
 * 서비스 롤 키를 사용하는 Supabase Admin 클라이언트
 * API Route(서버)에서만 사용해야 합니다. 클라이언트에 노출 금지.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. .env.local에 추가해주세요.')

  return createClient<Database>(url, serviceRoleKey)
}
