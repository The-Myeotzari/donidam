import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { verifyPin } from '@/shared/lib/pin'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const BodySchema = z.object({
  pin: z.string().regex(/^\d{4}$/, '4자리 숫자를 입력해주세요'),
})

// GET /api/auth/pin/verify — PIN 설정 여부 확인
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const { data, error } = await supabase
    .from('profiles')
    .select('app_pin')
    .eq('id', user.id)
    .single()

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ hasPin: !!data?.app_pin })
}

// POST /api/auth/pin/verify — PIN 검증
export async function POST(request: Request) {
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

  const { data, error } = await supabase
    .from('profiles')
    .select('app_pin')
    .eq('id', user.id)
    .single()

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  if (!data?.app_pin) {
    return NextResponse.json({ verified: true })
  }

  const verified = await verifyPin(parsed.data.pin, data.app_pin)
  if (!verified) {
    return apiError(request, 'UNAUTHORIZED', 401, '비밀번호가 틀렸습니다')
  }

  return NextResponse.json({ verified: true })
}
