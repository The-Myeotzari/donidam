import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const AddPaymentMethodBodySchema = z.object({
  type: z.enum(['card', 'account']),
  bankName: z.string().trim().min(1, '은행/카드사를 선택해주세요'),
  name: z.string().trim().min(1, '별칭을 입력해주세요').max(50),
  lastFour: z.string().regex(/^\d{4}$/, '뒷자리 4자리 숫자를 입력해주세요'),
  isFirst: z.boolean(),
})

// GET /api/payment-methods — 결제 수단 목록 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return NextResponse.json(data)
}

// POST /api/payment-methods — 결제 수단 추가
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

  const parsed = AddPaymentMethodBodySchema.safeParse(raw)
  if (!parsed.success) {
    return apiError(request, 'INVALID_REQUEST', 400, parsed.error.issues[0].message)
  }

  const { type, bankName, name, lastFour, isFirst } = parsed.data

  const { error } = await supabase.from('payment_methods').insert({
    user_id: user.id,
    type,
    name,
    last_four: lastFour,
    bank_name: bankName,
    is_default: isFirst,
  })

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 201 })
}
