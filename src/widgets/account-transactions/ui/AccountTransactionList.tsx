'use client'

import { AccountBalanceCard } from '@/entities/autofill/ui/AccountBalanceCard'
import { AccountTransactionItem } from '@/entities/autofill/ui/AccountTransactionItem'
import { AccountManageActions } from '@/features/autofill/ui/AccountManageActions'
import { TransactionFilterBar } from '@/features/autofill/ui/TransactionFilterBar'
import { useAccountTransactionsVM } from '../model/useAccountTransactionsVM'

function formatDate(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

export function AccountTransactionList() {
  const { account, grouped, dates, searchQuery, onSearchChange, isManageMode, selectedIds, toggleSelect } =
    useAccountTransactionsVM()

  return (
    <div>
      <AccountBalanceCard account={account} />
      <AccountManageActions />
      <TransactionFilterBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <div>
        {dates.map((date, idx) => (
          <div key={date}>
            <p className="pt-4 text-xs text-muted-foreground">{formatDate(date)}</p>
            {grouped[date].map((tx) => (
              <AccountTransactionItem
                key={tx.id}
                tx={tx}
                isManageMode={isManageMode}
                isSelected={selectedIds.has(tx.id)}
                onSelect={toggleSelect}
              />
            ))}
            {idx < dates.length - 1 && <div className="border-b border-border" />}
          </div>
        ))}
      </div>
    </div>
  )
}
