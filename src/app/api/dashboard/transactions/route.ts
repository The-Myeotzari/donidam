import { TRANSACTION_CATEGORIES } from '@/shared/constants/transactionCategory'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// 지출 추가/수입 추가 API =========================================================
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

  return NextResponse.json({
    ok: true,
    data: {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      isFixed: data.is_fixed,
      createdAt: data.created_at,
      end_date: data.end_date,
    },
  })
}

// 거래 조회 API =========================================================
type SortOption = 'createdAt:desc' | 'createdAt:asc'
type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

function parseBoolean(value: string | null) {
  if (value === null) return undefined
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function encodeCursor(payload: { lastId: number; lastCreatedAt: string }) {
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

function decodeCursor(cursor: string) {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString())
    if (!decoded.lastId || !decoded.lastCreatedAt) return null
    return decoded as { lastId: number; lastCreatedAt: string }
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase } = auth
  const url = new URL(request.url)

  const type = url.searchParams.get('type')
  const category = url.searchParams.get('category')
  const categoriesParam = url.searchParams.get('categories')
  const isFixedParam = url.searchParams.get('isFixed')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const limitParam = url.searchParams.get('limit')
  const cursor = url.searchParams.get('cursor')
  const sort = (url.searchParams.get('sort') ?? 'createdAt:desc') as SortOption
  const includeSummary = url.searchParams.get('includeSummary') === 'true'

  const TRANSACTION_TYPES = ['OUT', 'IN'] as const
  type TransactionType = (typeof TRANSACTION_TYPES)[number]
  if (type && !TRANSACTION_TYPES.includes(type as TransactionType)) {
    return apiError(request, 'TYPE_MISMATCH', 400, `Invalid value for parameter 'type': ${type}`)
  }

  if (category && categoriesParam) {
    return apiError(
      request,
      'INVALID_REQUEST',
      400,
      `Cannot use 'category' and 'categories' together`,
    )
  }

  if (sort !== 'createdAt:desc' && sort !== 'createdAt:asc') {
    return apiError(request, 'INVALID_REQUEST', 400, `Invalid sort option`)
  }

  const limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT
  if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
    return apiError(
      request,
      'INVALID_REQUEST',
      400,
      `Invalid 'limit'. Must be between 1 and ${MAX_LIMIT}`,
    )
  }

  const isFixed = parseBoolean(isFixedParam)

  const categories = categoriesParam
    ? categoriesParam
        .split(',')
        .map((c) => c.trim())
        .filter((c): c is TransactionCategory =>
          TRANSACTION_CATEGORIES.includes(c as TransactionCategory),
        )
    : category && TRANSACTION_CATEGORIES.includes(category as TransactionCategory)
      ? [category as TransactionCategory]
      : undefined

  let cursorPayload: { lastId: number; lastCreatedAt: string } | null = null

  if (cursor) {
    cursorPayload = decodeCursor(cursor)
    if (!cursorPayload) {
      return apiError(request, 'INVALID_REQUEST', 400, `Invalid cursor format`)
    }
  }

  let query = supabase
    .from('transactions')
    .select('id,type,category,amount,is_fixed,created_at,updated_at')

  if (type) query = query.eq('type', type as TransactionType)
  if (isFixed !== undefined) query = query.eq('is_fixed', isFixed)
  if (categories) query = query.in('category', categories)
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)

  const isDesc = sort === 'createdAt:desc'

  query = query.order('created_at', { ascending: !isDesc })
  query = query.order('id', { ascending: !isDesc })

  if (cursorPayload) {
    if (isDesc) {
      query = query.or(
        `created_at.lt.${cursorPayload.lastCreatedAt},and(created_at.eq.${cursorPayload.lastCreatedAt},id.lt.${cursorPayload.lastId})`,
      )
    } else {
      query = query.or(
        `created_at.gt.${cursorPayload.lastCreatedAt},and(created_at.eq.${cursorPayload.lastCreatedAt},id.gt.${cursorPayload.lastId})`,
      )
    }
  }

  query = query.limit(limit + 1)

  const { data, error } = await query

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  const hasMore = data.length > limit
  const items = hasMore ? data.slice(0, limit) : data

  const lastItem = items[items.length - 1]

  const nextCursor =
    hasMore && lastItem
      ? encodeCursor({
          lastId: lastItem.id,
          lastCreatedAt: lastItem.created_at,
        })
      : null

  let summary:
    | {
        totalIncome: number
        totalExpense: number
      }
    | undefined

  if (includeSummary) {
    const { data: summaryData, error: summaryError } = await supabase
      .from('transactions')
      .select('type, amount')

    if (summaryError) {
      return apiError(request, 'INTERNAL_SERVER_ERROR', 500, summaryError.message)
    }

    let totalIncome = 0
    let totalExpense = 0

    for (const row of summaryData) {
      if (row.type === 'IN') totalIncome += row.amount
      if (row.type === 'OUT') totalExpense += row.amount
    }

    summary = { totalIncome, totalExpense }
  }

  return NextResponse.json({
    ok: true,
    data: {
      items: items.map((row) => ({
        id: row.id,
        type: row.type,
        category: row.category,
        amount: row.amount,
        isFixed: row.is_fixed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      page: {
        nextCursor,
        hasMore,
      },
      ...(includeSummary ? { summary } : {}),
    },
  })
}
