// 한국 주요 은행 및 카드사 목록
export const BANKS = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'NH농협은행',
  'IBK기업은행',
  'SC제일은행',
  '씨티은행',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
  '새마을금고',
  '신협',
  '수협은행',
  '우체국',
  '대구은행',
  '부산은행',
  '광주은행',
  '전북은행',
  '경남은행',
  '제주은행',
] as const

export const CARD_COMPANIES = [
  '삼성카드',
  '현대카드',
  'KB국민카드',
  '신한카드',
  '롯데카드',
  '우리카드',
  '하나카드',
  'NH농협카드',
  'BC카드',
  '씨티카드',
] as const

export type Bank = (typeof BANKS)[number]
export type CardCompany = (typeof CARD_COMPANIES)[number]
