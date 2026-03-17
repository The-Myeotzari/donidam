import { createClient } from '@supabase/supabase-js'
import {
  BUDGET_TEMPLATES,
  STATS_TEMPLATES,
  RETENTION_TEMPLATES,
  NODAM_TEMPLATES,
} from '@/shared/constants/notification'
import type { PushPayload } from './webpush'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// ─────────────────────────────────────────
// A. 예산 관리형 조건 판단
// ─────────────────────────────────────────

export async function buildBudgetPayload(userId: string): Promise<PushPayload | null> {
  const supabase = createAdminClient()
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const daysInMonth = new Date(year, month, 0).getDate()
  const elapsedDays = kstNow.getUTCDate()

  // 예산 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('monthly_budget')
    .eq('id', userId)
    .single()

  if (!profile?.monthly_budget) return null

  // 이번 달 지출 합계
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

  const { data: txData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'OUT')
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd)

  const totalSpent = txData?.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const burnRate = Math.round((totalSpent / profile.monthly_budget) * 100)
  const elapsedRate = Math.round((elapsedDays / daysInMonth) * 100)
  const remainingDays = daysInMonth - elapsedDays
  const remainingBudget = profile.monthly_budget - totalSpent
  const dailyLimit = remainingDays > 0 ? Math.floor(remainingBudget / remainingDays) : 0

  // 임계치 (80, 90, 100%)
  if (burnRate >= 80) {
    return BUDGET_TEMPLATES.threshold(burnRate, remainingDays, dailyLimit)
  }

  // 속도 초과
  if (burnRate > elapsedRate) {
    return BUDGET_TEMPLATES.speeding(burnRate)
  }

  // 순항 (경과율보다 10% 이상 여유)
  if (elapsedRate - burnRate >= 10) {
    return BUDGET_TEMPLATES.sailing(burnRate)
  }

  return null
}

// ─────────────────────────────────────────
// B. 통계 인사이트형 조건 판단
// ─────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '식비',
  CAFE: '카페',
  TRANSPORT: '교통',
  HOUSING: '주거',
  SHOPPING: '쇼핑',
  MEDICAL: '의료',
  EDUCATION: '교육',
  LEISURE: '여가',
  ETC: '기타',
}

export async function buildWeeklyStatsPayload(userId: string): Promise<PushPayload | null> {
  const supabase = createAdminClient()
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)

  // 지난주 범위 (월~일)
  const dayOfWeek = kstNow.getDay() // 0=일, 1=월
  const lastMonday = new Date(kstNow)
  lastMonday.setDate(kstNow.getDate() - dayOfWeek - 6)
  lastMonday.setHours(0, 0, 0, 0)
  const lastSunday = new Date(lastMonday)
  lastSunday.setDate(lastMonday.getDate() + 6)
  lastSunday.setHours(23, 59, 59, 999)

  // 2주 전 범위
  const prevMonday = new Date(lastMonday)
  prevMonday.setDate(lastMonday.getDate() - 7)
  const prevSunday = new Date(lastSunday)
  prevSunday.setDate(lastSunday.getDate() - 7)

  const [{ data: lastWeekTx }, { data: prevWeekTx }] = await Promise.all([
    supabase
      .from('transactions')
      .select('amount, category')
      .eq('user_id', userId)
      .eq('type', 'OUT')
      .gte('created_at', lastMonday.toISOString())
      .lte('created_at', lastSunday.toISOString()),
    supabase
      .from('transactions')
      .select('amount, category')
      .eq('user_id', userId)
      .eq('type', 'OUT')
      .gte('created_at', prevMonday.toISOString())
      .lte('created_at', prevSunday.toISOString()),
  ])

  if (!lastWeekTx?.length) return null

  // 카테고리별 합산
  const lastWeekByCategory: Record<string, number> = {}
  for (const tx of lastWeekTx) {
    lastWeekByCategory[tx.category] = (lastWeekByCategory[tx.category] ?? 0) + tx.amount
  }

  const prevWeekByCategory: Record<string, number> = {}
  for (const tx of prevWeekTx ?? []) {
    prevWeekByCategory[tx.category] = (prevWeekByCategory[tx.category] ?? 0) + tx.amount
  }

  // 가장 많이 증가한 카테고리 찾기
  let maxChangePercent = 0
  let maxCategory = ''

  for (const [cat, amount] of Object.entries(lastWeekByCategory)) {
    const prev = prevWeekByCategory[cat] ?? 0
    if (prev === 0) continue
    const changePercent = Math.round(((amount - prev) / prev) * 100)
    if (changePercent > maxChangePercent) {
      maxChangePercent = changePercent
      maxCategory = cat
    }
  }

  if (maxChangePercent >= 10 && maxCategory) {
    const label = CATEGORY_LABELS[maxCategory] ?? maxCategory
    return STATS_TEMPLATES.weeklyCategory(label, maxChangePercent)
  }

  return null
}

// ─────────────────────────────────────────
// C. 리텐션 유도형 조건 판단
// ─────────────────────────────────────────

export async function buildRetentionPayload(userId: string): Promise<PushPayload | null> {
  const supabase = createAdminClient()
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const todayStart = new Date(kstNow)
  todayStart.setUTCHours(todayStart.getUTCHours() - 9, 0, 0, 0) // KST 00:00 → UTC

  const { data: todayTx } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .gte('created_at', todayStart.toISOString())

  const outTx = todayTx?.filter((t) => t.type === 'OUT') ?? []

  // 지출 기록 0건 → 기록 유도
  if (outTx.length === 0) {
    const totalOut = 0
    // 0원이면 무지출 축하 (23시 이후)
    const kstHour = (new Date().getUTCHours() + 9) % 24
    if (kstHour >= 23 && totalOut === 0) {
      return RETENTION_TEMPLATES.zeroSpending()
    }
    return RETENTION_TEMPLATES.noRecord()
  }

  return null
}

// ─────────────────────────────────────────
// E. 노담 조건 판단
// ─────────────────────────────────────────

export async function buildNodamPayload(userId: string): Promise<PushPayload | null> {
  const supabase = createAdminClient()

  const { data: status } = await supabase
    .from('nodam_status')
    .select('start_date, daily_smoke_cost')
    .eq('user_id', userId)
    .single()

  if (!status) return null

  const startDate = new Date(status.start_date)
  const now = new Date()
  const diffMs = now.getTime() - startDate.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const savedAmount = days * status.daily_smoke_cost

  return NODAM_TEMPLATES.dailySuccess(days, savedAmount, '목표')
}
