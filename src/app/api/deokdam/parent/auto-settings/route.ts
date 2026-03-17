import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 자동 덕담 설정 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const { data, error } = await supabase
    .from('auto_allowance_settings')
    .select('*')
    .eq('parent_id', user.id)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  const settings = data ?? []
  const enabledSettings = settings.filter((s) => s.enabled)
  const anyEnabled = enabledSettings.length > 0
  const nextDay = enabledSettings[0]?.day ?? null
  const totalAmount = enabledSettings.reduce((sum, s) => sum + (s.amount ?? 0), 0)

  // 자녀 이름 조회
  const admin = createAdminClient()
  const childNames = await Promise.all(
    enabledSettings.map(async (s) => {
      try {
        const { data: userData } = await admin.auth.admin.getUserById(s.child_id)
        const email = userData?.user?.email ?? ''
        return email.split('@')[0] ?? '자녀'
      } catch {
        return '자녀'
      }
    }),
  )

  return NextResponse.json({
    ok: true,
    data: {
      enabled: anyEnabled,
      nextPayDay: nextDay,
      totalAmount,
      childNames,
      settings,
    },
  })
}

// 자동 덕담 토글
export async function PATCH(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const body = await request.json()
  const enabled: boolean = body?.enabled

  if (typeof enabled !== 'boolean') {
    return apiError(request, 'INVALID_REQUEST', 400, 'enabled는 boolean이어야 합니다.')
  }

  const { error } = await supabase
    .from('auto_allowance_settings')
    .update({ enabled })
    .eq('parent_id', user.id)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ ok: true })
}
