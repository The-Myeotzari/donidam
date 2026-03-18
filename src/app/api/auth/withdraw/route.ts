import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'

// 현재 로그인된 유저의 계정을 완전히 삭제
export async function DELETE(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { user } = auth
  const admin = createAdminClient()

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return new Response(null, { status: 204 })
}
