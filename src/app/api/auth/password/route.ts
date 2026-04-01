import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { hashPin } from '@/shared/lib/pin'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const BodySchema = z.object({
  pin: z.string().regex(/^\d{4}$/, '4자리 숫자를 입력해주세요'),
})

// PATCH /api/auth/password — 앱 비밀번호(4자리 PIN) 설정·변경
export async function PATCH(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return apiError(request, 'INVALID_REQUEST', 400, 'Invalid JSON body')
  }

  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    return apiError(request, 'INVALID_REQUEST', 400, parsed.error.issues[0].message)
  }

  const hashed = await hashPin(parsed.data.pin)

  const { error } = await supabase.from('profiles').update({ app_pin: hashed }).eq('id', user.id)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return new NextResponse(null, { status: 204 })
}
