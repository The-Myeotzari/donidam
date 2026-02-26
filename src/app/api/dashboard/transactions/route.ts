import { TRANSACTION_CATEGORIES } from '@/shared/constants/transactionCategory'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const CreateTransactionBodySchema = z.object({
  type: z.enum(['OUT', 'IN']),
  category: z.enum(TRANSACTION_CATEGORIES),
  amount: z.number().int().min(0, 'amount 값은 0 이상'),
  isFixed: z.boolean(),
  createdAt: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  // TODO: "거래 계좌내용" 테이블 반영 후 account 관련 컬럼 추가 예정
  // TODO: "내용" 컬럼 테이블 반영 후 추가 예정
})

// 지출 추가/수입 추가 API
export async function POST(request: Request) {
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

  // Zod 검증
  const parsed = CreateTransactionBodySchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return apiError(request, 'INVALID_REQUEST', 400, first?.message ?? 'Invalid request body')
  }

  const body = parsed.data

  const insertPayload = {
    user_id: user.id,
    type: body.type,
    category: body.category,
    amount: body.amount,
    is_fixed: body.isFixed,
    created_at: body.createdAt,
    endDate: body.endDate ?? null,
    // TODO: "거래 계좌내용" 테이블 반영 후 account 관련 컬럼 추가 예정
    // TODO: "내용" 컬럼 테이블 반영 후 추가 예정
  }

  // insert
  const { data, error } = await supabase
    .from('transactions')
    .insert(insertPayload)
    .select('id, type, category, amount, is_fixed, created_at, end_date')
    .single()

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json(
    {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      isFixed: data.is_fixed,
      createdAt: data.created_at,
      end_date: data.end_date,
    },
    { status: 201 },
  )
}
