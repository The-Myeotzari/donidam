'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calendar } from '@/shared/ui/Calendar'
import { useTransactionsByMonth } from '@/entities/transaction/lib/useTransactionsByMonth'
import { TransactionList, CATEGORY_CONFIG } from '@/entities/transaction/ui/TransactionList'
import { formatDateKey, formatAmount } from '@/entities/transaction/lib/format'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { transactionsByDate, isLoading, isError, changeMonth } = useTransactionsByMonth()

  const selectedTransactions = useMemo(
    () => transactionsByDate[formatDateKey(selectedDate)] ?? [],
    [transactionsByDate, selectedDate],
  )

  const totalOut = useMemo(
    () =>
      selectedTransactions
        .filter((t) => t.type === 'OUT')
        .reduce((sum, t) => sum + t.amount, 0),
    [selectedTransactions],
  )

  const totalIn = useMemo(
    () =>
      selectedTransactions
        .filter((t) => t.type === 'IN')
        .reduce((sum, t) => sum + t.amount, 0),
    [selectedTransactions],
  )

  const renderDayContent = useCallback(
    (date: Date) => {
      const txs = transactionsByDate[formatDateKey(date)]
      if (!txs || txs.length === 0) return null
      const uniqueCategories = [...new Set(txs.map((t) => t.category))].slice(0, 3)
      return (
        <>
          {uniqueCategories.map((cat) => (
            <span
              key={cat}
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: CATEGORY_CONFIG[cat].color }}
            />
          ))}
        </>
      )
    },
    [transactionsByDate],
  )

  return (
    <div className="flex flex-col gap-4">
      <Calendar value={selectedDate} onChange={setSelectedDate} onMonthChange={changeMonth}>
        <Calendar.Header>
          <Calendar.PrevButton />
          <Calendar.MonthYearSelect />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid renderDayContent={renderDayContent} />
      </Calendar>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-semibold">
          {selectedDate.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </h2>
        {selectedTransactions.length > 0 && (
          <div className="flex gap-3 text-sm">
            {totalIn > 0 && (
              <span className="font-medium text-secondary">+{formatAmount(totalIn)}원</span>
            )}
            {totalOut > 0 && (
              <span className="font-medium text-destructive">-{formatAmount(totalOut)}원</span>
            )}
          </div>
        )}
      </div>

      <TransactionList
        transactions={selectedTransactions}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}