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
