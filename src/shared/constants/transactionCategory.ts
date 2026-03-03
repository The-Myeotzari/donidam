import {
  BookOpen,
  Bus,
  Coffee,
  Gamepad2,
  Home,
  type LucideIcon,
  Package,
  Pill,
  ShoppingBag,
  Utensils,
} from 'lucide-react'

export const TRANSACTION_CATEGORIES = [
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

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]

export const TRANSACTION_CATEGORY_LABEL: Record<TransactionCategory, string> = {
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

export const TRANSACTION_CATEGORY_ICON: Record<TransactionCategory, LucideIcon> = {
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

export const TRANSACTION_CATEGORY_THEME: Record<TransactionCategory, { bg: string; icon: string }> =
  {
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
