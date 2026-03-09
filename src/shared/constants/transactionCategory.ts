import {
  Banknote,
  BookOpen,
  Briefcase,
  Bus,
  Coffee,
  Gamepad2,
  Gift,
  Home,
  type LucideIcon,
  Package,
  Pill,
  ShoppingBag,
  Utensils,
} from 'lucide-react'

// 지출 카테고리 =====================================================
export const EXPENSE_CATEGORIES = [
  'FOOD',
  'CAFE',
  'TRANSPORT',
  'HOUSING',
  'SHOPPING',
  'MEDICAL',
  'EDUCATION',
  'LEISURE',
  'ETC',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategory, string> = {
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

export const EXPENSE_CATEGORY_ICON: Record<ExpenseCategory, LucideIcon> = {
  FOOD: Utensils,
  CAFE: Coffee,
  TRANSPORT: Bus,
  HOUSING: Home,
  SHOPPING: ShoppingBag,
  MEDICAL: Pill,
  EDUCATION: BookOpen,
  LEISURE: Gamepad2,
  ETC: Package,
}

export const EXPENSE_CATEGORY_THEME: Record<ExpenseCategory, { bg: string; icon: string }> = {
  FOOD: { bg: 'bg-orange-100', icon: 'text-orange-500' },
  CAFE: { bg: 'bg-amber-100', icon: 'text-amber-600' },
  TRANSPORT: { bg: 'bg-sky-100', icon: 'text-sky-500' },
  HOUSING: { bg: 'bg-teal-100', icon: 'text-teal-500' },
  SHOPPING: { bg: 'bg-rose-100', icon: 'text-rose-500' },
  MEDICAL: { bg: 'bg-red-100', icon: 'text-red-500' },
  EDUCATION: { bg: 'bg-violet-100', icon: 'text-violet-500' },
  LEISURE: { bg: 'bg-lime-100', icon: 'text-lime-600' },
  ETC: { bg: 'bg-slate-100', icon: 'text-slate-500' },
}

// 수입 카테고리 =====================================================
export const INCOME_CATEGORIES = ['SALARY', 'SIDE_JOB', 'ALLOWANCE', 'ETC'] as const

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]

export const INCOME_CATEGORY_LABEL: Record<IncomeCategory, string> = {
  SALARY: '급여',
  SIDE_JOB: '부업',
  ALLOWANCE: '용돈',
  ETC: '기타',
}

export const INCOME_CATEGORY_ICON: Record<IncomeCategory, LucideIcon> = {
  SALARY: Banknote,
  SIDE_JOB: Briefcase,
  ALLOWANCE: Gift,
  ETC: Package,
}

export const INCOME_CATEGORY_THEME: Record<IncomeCategory, { bg: string; icon: string }> = {
  SALARY: { bg: 'bg-green-100', icon: 'text-green-600' },
  SIDE_JOB: { bg: 'bg-blue-100', icon: 'text-blue-500' },
  ALLOWANCE: { bg: 'bg-pink-100', icon: 'text-pink-500' },
  ETC: { bg: 'bg-slate-100', icon: 'text-slate-500' },
}
