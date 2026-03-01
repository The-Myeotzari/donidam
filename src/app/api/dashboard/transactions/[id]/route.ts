import { TRANSACTION_CATEGORIES, TransactionCategory } from '@/shared/constants/transactionCategory'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const id = Number(params.id)

  if (!id || isNaN(id)) {
    return apiError(request, 'INVALID_REQUEST', 400, `Invalid transaction id`)
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('id, type, category, amount, is_fixed, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return apiError(request, 'NOT_FOUND', 404, `Transaction not found`)
    }

    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({
    ok: true,
    data: {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      isFixed: data.is_fixed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  })
}

const UpdateTransactionBodySchema = z
  .object({
    category: z.enum(TRANSACTION_CATEGORIES).optional(),
    amount: z.number().int().min(0).optional(),
    isFixed: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.category !== undefined || data.amount !== undefined || data.isFixed !== undefined,
    {
      message: 'At least one field must be provided',
    },
  )

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const id = Number(params.id)

  if (!id || isNaN(id)) {
    return apiError(request, 'INVALID_REQUEST', 400, 'Invalid transaction id')
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return apiError(request, 'INVALID_REQUEST', 400, 'Invalid JSON body')
  }

  const parsed = UpdateTransactionBodySchema.safeParse(raw)

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return apiError(request, 'INVALID_REQUEST', 400, first?.message ?? 'Invalid request body')
  }

  const body = parsed.data

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.category) updatePayload.category = body.category as TransactionCategory

  if (body.amount !== undefined) updatePayload.amount = body.amount

  if (body.isFixed !== undefined) updatePayload.is_fixed = body.isFixed

  const { data, error } = await supabase
    .from('transactions')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, type, category, amount, is_fixed, created_at, updated_at')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return apiError(request, 'NOT_FOUND', 404, 'Transaction not found')
    }

    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({
    ok: true,
    data: {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      isFixed: data.is_fixed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  })
}
