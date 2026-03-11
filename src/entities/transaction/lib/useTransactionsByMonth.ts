'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionsByMonth } from '../api/transaction.queries'
import { formatDateKey } from './format'
import type { Transaction } from '../model/transaction.types'

export function useTransactionsByMonth() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['transactions', currentMonth.getFullYear(), currentMonth.getMonth()],
    queryFn: () => fetchTransactionsByMonth(currentMonth),
  })

  const transactionsByDate = useMemo(() => {
    const map: Record<string, Transaction[]> = {}
    transactions.forEach((tx) => {
      const key = formatDateKey(new Date(tx.created_at))
      if (!map[key]) map[key] = []
      map[key].push(tx)
    })
    return map
  }, [transactions])

  return { transactionsByDate, isLoading, isError, changeMonth: setCurrentMonth }
}