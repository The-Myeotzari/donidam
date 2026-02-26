// 서버 전용 유틸

import { MAIN_CARD_CODES, MAIN_CARD_THRESHOLDS } from '@/shared/constants/dashboardMainCard'
import 'server-only'

// KST(Asia/Seoul) 기준 오늘 날짜(년/월/일)를 구함.
function getKstTodayParts() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  const day = Number(parts.find((p) => p.type === 'day')?.value)

  return { year, month, day }
}

// 해당 월의 총 일수(28~31)를 구함. (month는 1~12를 넣는 전제)
function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate()
}

// "YYYY-MM-01" 형태의 문자열로 월의 1일을 만듦. (month는 1~12 / month는 항상 2자리로 패딩)
function formatMonthFirstDay(year: number, month1to12: number) {
  return `${year}-${String(month1to12).padStart(2, '0')}-01`
}

// (year, month)에서 1개월 증가한 값을 반환함. (12월이면 다음 해 1월로 넘어감)
function addOneMonth(year: number, month1to12: number) {
  if (month1to12 === 12) return { year: year + 1, month: 1 }
  return { year, month: month1to12 + 1 }
}

// month query param을 "YYYY-MM-01" 기준의 monthFirstDay로 확정
export function resolveMonthFirstDay(
  monthParam: string | null,
):
  | { ok: true; monthFirstDay: string }
  | { ok: false; title: string; status: number; detail: string } {
  // month 파라미터가 없으면 "이번 달"
  if (monthParam == null) {
    const now = getKstTodayParts()
    return { ok: true, monthFirstDay: formatMonthFirstDay(now.year, now.month) }
  }

  // 형식 강제: YYYY-MM-01만 허용 (예: 2026-02-01)
  if (!/^\d{4}-\d{2}-01$/.test(monthParam)) {
    return {
      ok: false,
      title: 'INVALID_REQUEST',
      status: 422,
      detail: 'month는 "YYYY-MM-01" 형식이어야 합니다. 예: "2026-02-01"',
    }
  }

  return { ok: true, monthFirstDay: monthParam }
}

/**
 * 월의 시작/끝 범위를 KST(+09:00) 기준 ISO 문자열로 만듦.
 * - created_at 필터를 월 단위로 정확히 자르기 위해 사용
 * - 범위는 [rangeStart, rangeEnd] 형태 (end는 exclusive)
 */
export function monthToKstRange(monthFirstDay: string) {
  const [y, m] = monthFirstDay.split('-')
  const year = Number(y)
  const month = Number(m)

  const next = addOneMonth(year, month)
  const nextMonthFirstDay = formatMonthFirstDay(next.year, next.month)

  return {
    monthFirstDay,
    rangeStart: `${monthFirstDay}T00:00:00+09:00`,
    rangeEnd: `${nextMonthFirstDay}T00:00:00+09:00`,
    year,
    month,
  }
}

/**
 * KST 기준으로 “해당 월 경과율(elapsedPercent)”과 “남은 일수(remainingDays)”를 계산함.
 * - 과거 월: 이미 끝난 달 → elapsedDays = totalDays (경과율 100)
 * - 현재 월: 오늘까지 경과 → elapsedDays = today(day-of-month)
 * - 미래 월: 아직 시작 전 → elapsedDays = 0
 *
 * elapsedPercent는 floor로 내림, 0~100으로 clamp.
 */
export function calcElapsedAndRemainingByMonthKst(monthFirstDay: string) {
  const [y, m] = monthFirstDay.split('-')
  const year = Number(y)
  const month = Number(m)

  const totalDays = daysInMonth(year, month)

  const now = getKstTodayParts()
  const isCurrentMonth = now.year === year && now.month === month

  let elapsedDays = 0
  if (now.year > year || (now.year === year && now.month > month)) {
    // 과거 월
    elapsedDays = totalDays
  } else if (isCurrentMonth) {
    // 현재 월
    elapsedDays = now.day
  } else {
    // 미래 월
    elapsedDays = 0
  }

  elapsedDays = Math.min(Math.max(elapsedDays, 0), totalDays)

  const elapsedPercent = Math.floor((elapsedDays / totalDays) * 100)
  const remainingDays = Math.max(0, totalDays - elapsedDays)

  return {
    elapsedDays,
    elapsedPercent: Math.min(Math.max(elapsedPercent, 0), 100),
    remainingDays,
    totalDays,
  }
}

type MainCardCode = (typeof MAIN_CARD_CODES)[number]

/**
 * 메인 카드 code를 정책 로직대로 결정
 *
 * 1) 예산 없음 → NO_BUDGET
 * 2) 강한 임계치(100/90) → THRESHOLD
 * 3) elapsed < spend → SPEED_CONTROL
 * 4) elapsed - spend >= 10 → CRUISING
 * 5) 완화된 임계치(80) → THRESHOLD
 * 6) 나머지 → DEFAULT
 */
export function decideMainCardCode(
  targetAmount: number,
  elapsedPercent: number,
  spendPercent: number,
): MainCardCode {
  if (targetAmount <= 0) return 'MAIN_CARD_NO_BUDGET'
  if (spendPercent >= MAIN_CARD_THRESHOLDS.THRESHOLD_100) return 'MAIN_CARD_THRESHOLD'
  if (spendPercent >= MAIN_CARD_THRESHOLDS.THRESHOLD_90) return 'MAIN_CARD_THRESHOLD'
  if (elapsedPercent < spendPercent) return 'MAIN_CARD_SPEED_CONTROL'
  if (elapsedPercent - spendPercent >= MAIN_CARD_THRESHOLDS.CRUISING_GAP)
    return 'MAIN_CARD_CRUISING'
  if (spendPercent >= MAIN_CARD_THRESHOLDS.THRESHOLD_80) return 'MAIN_CARD_THRESHOLD'
  return 'MAIN_CARD_DEFAULT'
}

/**
 * 예산 관련 파생 지표(vars)를 계산함.
 * - spendPercent: (총지출 / 예산) * 100 floor (100 초과 가능)
 * - remainingAmount: 예산 - 총지출 (음수 가능)
 * - dailyRecommendedAmount:
 *    - remainingDays가 0이면 분모가 0이 되므로 max(1, remainingDays)로 방어
 *    - 남은 예산이 음수면 권장액은 0으로 처리 (지출을 멈추라는 의미)
 */
export function calcBudgetVars(params: {
  targetAmount: number
  totalExpense: number
  remainingDays: number
}) {
  const { targetAmount, totalExpense, remainingDays } = params

  const spendPercent = Math.floor((totalExpense / targetAmount) * 100)
  const remainingAmount = Math.floor(targetAmount - totalExpense)
  const dailyRecommendedAmount = Math.max(
    0,
    Math.floor(remainingAmount / Math.max(1, remainingDays)),
  )

  return { spendPercent, remainingAmount, dailyRecommendedAmount }
}
