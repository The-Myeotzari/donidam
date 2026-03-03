import { Banknote, Briefcase, Gift, type LucideIcon, Package } from 'lucide-react'

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
