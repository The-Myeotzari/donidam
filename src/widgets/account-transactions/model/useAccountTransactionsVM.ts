'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { AccountTransaction, ConnectedAccountDetail } from '@/entities/autofill/model/autofill.types'
import { useManageMode } from '@/features/autofill/model/manage-mode'

// TODO: API 연동 시 accountsId로 데이터 fetch
const MOCK_ACCOUNT: ConnectedAccountDetail = {
  bankName: '국민은행',
  accountNumber: '123-3456-2346-234',
  balance: 200000,
}

const MOCK_TRANSACTIONS: AccountTransaction[] = [
  { id: '1', name: '쿠팡', time: '15:23', amount: -50000, balanceAfter: 250000, date: '2025-02-03' },
  { id: '2', name: '훈련장려금', time: '11:09', amount: 50000, balanceAfter: 250000, date: '2025-02-02' },
  { id: '3', name: '스타벅스', time: '09:15', amount: -5500, balanceAfter: 200000, date: '2025-02-01' },
  { id: '4', name: '월급', time: '08:00', amount: 150000, balanceAfter: 205500, date: '2025-01-31' },
]

function groupByDate(txs: AccountTransaction[]) {
  const map: Record<string, AccountTransaction[]> = {}
  for (const tx of txs) {
    if (!map[tx.date]) map[tx.date] = []
    map[tx.date].push(tx)
  }
  return map
}

export function useAccountTransactionsVM() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const { isManageMode, selectedIds, toggleSelect } = useManageMode()

  // Tabs 컴포넌트가 URL에 저장하는 filter 값으로 거래 필터링
  const activeFilter = searchParams.get('filter') ?? 'all'

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'income' && tx.amount > 0) ||
      (activeFilter === 'expense' && tx.amount < 0)
    const matchesSearch = !searchQuery || tx.name.includes(searchQuery)
    return matchesFilter && matchesSearch
  })

  const grouped = groupByDate(filteredTransactions)
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return {
    account: MOCK_ACCOUNT,
    grouped,
    dates,
    searchQuery,
    onSearchChange: setSearchQuery,
    isManageMode,
    selectedIds,
    toggleSelect,
  }
}
