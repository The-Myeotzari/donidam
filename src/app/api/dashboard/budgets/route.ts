import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 월별 예산 목표 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  // 예산 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('monthly_budget')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, profileError.message)
  }

  const targetAmount = Math.floor(profile.monthly_budget ?? 0)

  return NextResponse.json({
    ok: true,
    budgetData: {
      targetAmount: targetAmount,
    },
  })
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

// 월별 예산 목표 수정
export async function PUT(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  // JSON 파싱
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return apiError(request, 'INVALID_REQUEST', 400, 'Invalid JSON body')
  }

  if (!isRecord(raw)) {
    return apiError(request, 'INVALID_REQUEST', 400, 'Request body must be an object')
  }

  const targetAmountRaw = raw.targetAmount

  if (typeof targetAmountRaw !== 'number' || !Number.isFinite(targetAmountRaw)) {
    return apiError(request, 'INVALID_REQUEST', 400, 'targetAmount must be a number')
  }
  if (targetAmountRaw < 0) {
    return apiError(request, 'INVALID_REQUEST', 400, 'targetAmount must be >= 0')
  }

  const targetAmount = Math.floor(targetAmountRaw)

  const { data, error } = await supabase
    .from('profiles')
    .update({ monthly_budget: targetAmount })
    .eq('id', user.id)
    .select('monthly_budget')
    .maybeSingle()

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  if (!data) {
    return apiError(request, 'NOT_FOUND', 404, '프로필 정보를 찾을 수 없습니다.')
  }

  return NextResponse.json({
    ok: true,
    budgetData: {
      targetAmount: data.monthly_budget ?? 0,
    },
  })
}
