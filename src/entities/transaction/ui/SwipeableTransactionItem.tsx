'use client'

import { formatDate } from '@/entities/transaction/lib/formatDate'
import type { TransactionItem as TTransactionItem } from '@/entities/transaction/model/transaction.type'
import {
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
  INCOME_CATEGORY_ICON,
  INCOME_CATEGORY_LABEL,
  INCOME_CATEGORY_THEME,
  type ExpenseCategory,
  type IncomeCategory,
} from '@/shared/constants/transactionCategory'
import { useEffect, useRef, useState } from 'react'

const ACTION_WIDTH = 144 // 수정 + 삭제 버튼 총 너비 (px)

type Props = {
  item: TTransactionItem
  onEdit: (item: TTransactionItem) => void
  onDelete: (id: number) => void
}

export function SwipeableTransactionItem({ item, onEdit, onDelete }: Props) {
  const isExpense = item.type === 'OUT'

  const Icon = isExpense
    ? EXPENSE_CATEGORY_ICON[item.category as ExpenseCategory]
    : INCOME_CATEGORY_ICON[item.category as IncomeCategory]

  const label = isExpense
    ? EXPENSE_CATEGORY_LABEL[item.category as ExpenseCategory]
    : INCOME_CATEGORY_LABEL[item.category as IncomeCategory]

  const theme = isExpense
    ? EXPENSE_CATEGORY_THEME[item.category as ExpenseCategory]
    : INCOME_CATEGORY_THEME[item.category as IncomeCategory]

  const dateLabel = formatDate(item.createdAt)

  const [offset, setOffset] = useState(0) // 0 = 닫힘, ACTION_WIDTH = 열림
  const isOpen = offset === ACTION_WIDTH

  const ref = useRef<HTMLLIElement>(null)
  const touchStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOffset(0)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [isOpen])

  // 모바일 스와이프
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.touches[0].clientX
    if (Math.abs(delta) > 5) isDragging.current = true
    const clamped = Math.max(0, Math.min(delta + (isOpen ? ACTION_WIDTH : 0), ACTION_WIDTH))
    setOffset(clamped)
  }

  const handleTouchEnd = () => {
    setOffset(offset > ACTION_WIDTH / 2 ? ACTION_WIDTH : 0)
    touchStartX.current = null
  }

  // 웹 클릭으로 토글
  const handleClick = () => {
    if (isDragging.current) return
    setOffset((prev) => (prev === ACTION_WIDTH ? 0 : ACTION_WIDTH))
  }

  return (
    <li ref={ref} className="relative overflow-hidden border-b last:border-b-0">
      {/* 오른쪽 배경 버튼 영역 */}
      <div className="absolute right-0 top-0 bottom-0 flex" style={{ width: ACTION_WIDTH }}>
        <button
          type="button"
          onClick={() => {
            setOffset(0)
            onEdit(item)
          }}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#8E8E93] text-white text-xs font-medium"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => {
            setOffset(0)
            onDelete(item.id)
          }}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#FF3B30] text-white text-xs font-medium"
        >
          삭제
        </button>
      </div>

      {/* 메인 아이템 (왼쪽으로 슬라이드) */}
      <div
        className="relative flex items-center gap-3 py-3 bg-card cursor-pointer select-none"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.25s ease',
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 아이콘 */}
        <div
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg}`}
        >
          <Icon size={18} className={theme.icon} />
        </div>

        {/* 텍스트 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-muted-foreground">
            {label} · {dateLabel}
          </p>
        </div>

        {/* 금액 */}
        <span
          className={`pr-1 text-sm font-semibold tabular-nums shrink-0 ${isExpense ? 'text-foreground' : 'text-primary'}`}
        >
          {isExpense ? '-' : '+'}
          {item.amount.toLocaleString('ko-KR')}원
        </span>
      </div>
    </li>
  )
}
