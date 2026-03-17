import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'

const PreferencesSchema = z.object({
  push_enabled: z.boolean().optional(),
  email_enabled: z.boolean().optional(),
  budget_control_enabled: z.boolean().optional(),
  stats_insight_enabled: z.boolean().optional(),
  retention_enabled: z.boolean().optional(),
  dukdam_enabled: z.boolean().optional(),
  nodam_enabled: z.boolean().optional(),
  notification_mode: z.enum(['nag', 'cheer', 'balanced']).optional(),
})

// GET /api/notifications/preferences
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  // 기본값 반환 (설정 없으면 upsert)
  if (!data) {
    const defaults = {
      user_id: user.id,
      push_enabled: true,
      email_enabled: false,
      budget_control_enabled: true,
      stats_insight_enabled: true,
      retention_enabled: true,
      dukdam_enabled: true,
      nodam_enabled: true,
      notification_mode: 'balanced' as const,
    }
    const { data: created, error: createError } = await supabase
      .from('notification_preferences')
      .upsert(defaults)
      .select()
      .single()

    if (createError) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, createError.message)
    return NextResponse.json(created)
  }

  return NextResponse.json(data)
}

// PUT /api/notifications/preferences
export async function PUT(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return apiError(request, 'INVALID_REQUEST', 400, 'Invalid JSON body')
  }

  const parsed = PreferencesSchema.safeParse(raw)
  if (!parsed.success) {
    return apiError(request, 'INVALID_REQUEST', 400, parsed.error.issues[0].message)
  }

  const { error } = await supabase
    .from('notification_preferences')
    .upsert({ user_id: user.id, ...parsed.data, updated_at: new Date().toISOString() })

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}
