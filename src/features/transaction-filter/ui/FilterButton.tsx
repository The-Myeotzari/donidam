'use client'

import { useTransactionFilter } from '@/features/transaction-filter/model/useTransactionFilter'
import { BottomSheet } from '@/shared/ui/BottomSheet'
import { Button } from '@/shared/ui/Button'
import { ListFilter, X } from 'lucide-react'
import { CategorySelect } from './CategorySelect'
import { DateRangeSelect } from './DateRangeSelect'

export function FilterButton() {
  const {
    open,
    setOpen,
    filterCount,
    selectedCategories,
    from,
    to,
    setFrom,
    setTo,
    handleOpen,
    handleApply,
    handleReset,
    toggleCategory,
  } = useTransactionFilter()

  return (
    <>
      {/* 트리거 버튼 */}
      <button
        onClick={handleOpen}
        aria-label="필터"
        className="relative w-10 h-10 rounded-full bg-card card-shadow flex items-center justify-center"
      >
        <ListFilter size={20} className="text-muted-foreground" />
        {filterCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1">
            {filterCount}
          </span>
        )}
      </button>

      {/* 필터 BottomSheet */}
      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <BottomSheet.Header>
          <span className="text-base font-bold">필터</span>
          <BottomSheet.Close>
            <button aria-label="닫기">
              <X size={20} className="text-muted-foreground" />
            </button>
          </BottomSheet.Close>
        </BottomSheet.Header>

        <BottomSheet.Content className="max-h-[60vh] space-y-6">
          <CategorySelect selected={selectedCategories} onToggle={toggleCategory} />
          <DateRangeSelect
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
          />
        </BottomSheet.Content>

        <div className="flex gap-2 mt-5">
          <Button variant="outline" onClick={handleReset} className="shrink-0 px-5">
            초기화
          </Button>
          <Button onClick={handleApply} fullWidth>
            적용하기
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
