'use client'

import cn from '@/shared/lib/cn'
import React, { createContext, useContext, useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return isSameDay(date, today)
}

const generateCalendarDays = (currentMonth: Date): Date[] => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = getFirstDayOfMonth(currentMonth)
  const daysInMonth = getDaysInMonth(currentMonth)
  const daysInPrevMonth = getDaysInMonth(new Date(year, month - 1, 1))

  const days: Date[] = []

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, daysInPrevMonth - i))
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i))
  }

  return days
}

interface CalendarContextProps {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  isDateDisabled?: (date: Date) => boolean
}

const CalendarContext = createContext<CalendarContextProps | null>(null)

const useCalendarContext = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('Calendar 서브 컴포넌트는 Calendar 내부에서 사용되어야 한다')
  }
  return context
}

interface CalendarProps {
  children: React.ReactNode
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date) => void
  onMonthChange?: (month: Date) => void
  isDateDisabled?: (date: Date) => boolean
  className?: string
}

export const Calendar = ({
  children,
  value,
  defaultValue = null,
  onChange,
  onMonthChange,
  isDateDisabled,
  className,
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue)
  const [currentMonth, setCurrentMonthState] = useState<Date>(value || defaultValue || new Date())

  const controlledDate = value !== undefined ? value : selectedDate

  const setCurrentMonth = (date: Date) => {
    setCurrentMonthState(date)
    onMonthChange?.(date)
  }

  const handleDateSelect = (date: Date) => {
    if (value === undefined) {
      setSelectedDate(date)
    }
    onChange?.(date)
  }

  const contextValue: CalendarContextProps = {
    currentMonth,
    setCurrentMonth,
    selectedDate: controlledDate,
    onDateSelect: handleDateSelect,
    isDateDisabled,
  }

  return (
    <CalendarContext value={contextValue}>
      <div className={cn('w-full max-w-md rounded-xl bg-card p-3 soft-shadow', className)}>
        {children}
      </div>
    </CalendarContext>
  )
}

interface CalendarHeaderProps {
  children: React.ReactNode
  className?: string
}

const CalendarHeader = ({ children, className }: CalendarHeaderProps) => {
  return (
    <div className={cn('relative flex items-center justify-center pt-1', className)}>
      {children}
    </div>
  )
}

interface CalendarPrevButtonProps {
  className?: string
}

const CalendarPrevButton = ({ className }: CalendarPrevButtonProps) => {
  const { currentMonth, setCurrentMonth } = useCalendarContext()

  const handlePrev = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    setCurrentMonth(newMonth)
  }

  return (
    <button
      type="button"
      onClick={handlePrev}
      aria-label="이전 달"
      className={cn(
        'absolute left-1 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent opacity-50 transition-opacity hover:opacity-100',
        className,
      )}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  )
}

interface CalendarNextButtonProps {
  className?: string
}

const CalendarNextButton = ({ className }: CalendarNextButtonProps) => {
  const { currentMonth, setCurrentMonth } = useCalendarContext()

  const handleNext = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    setCurrentMonth(newMonth)
  }

  return (
    <button
      type="button"
      onClick={handleNext}
      aria-label="다음 달"
      className={cn(
        'absolute right-1 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent opacity-50 transition-opacity hover:opacity-100',
        className,
      )}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  )
}

interface CalendarMonthYearSelectProps {
  className?: string
}

const CalendarMonthYearSelect = ({ className }: CalendarMonthYearSelectProps) => {
  const { currentMonth } = useCalendarContext()

  const monthName = currentMonth.toLocaleDateString('ko-KR', { month: 'long' })
  const year = currentMonth.getFullYear()

  return (
    <div className={cn('text-sm font-medium', className)}>
      {monthName} {year}
    </div>
  )
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarGridProps {
  className?: string
  renderDayContent?: (date: Date) => React.ReactNode
}

const CalendarGrid = ({ className, renderDayContent }: CalendarGridProps) => {
  const { currentMonth, setCurrentMonth, selectedDate, onDateSelect, isDateDisabled } =
    useCalendarContext()

  const days = useMemo(() => generateCalendarDays(currentMonth), [currentMonth])

  const handleDayClick = (date: Date) => {
    if (isDateDisabled && isDateDisabled(date)) return
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
    onDateSelect(date)
  }
  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth.getMonth()

  return (
    <div className={cn('mt-4', className)} role="grid">
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-9 w-9 items-center justify-center text-[0.8rem] font-normal text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate)
          const isTodayDate = isToday(date)
          const isDisabled = isDateDisabled?.(date) || false
          const isOtherMonth = !isCurrentMonth(date)

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDayClick(date)}
              disabled={isDisabled}
              role="gridcell"
              aria-selected={isSelected}
              aria-label={date.toLocaleDateString('ko-KR')}
              className={cn(
                'mt-2 flex w-9 flex-col items-center rounded-md text-sm font-normal transition-colors',
                renderDayContent ? 'h-12 justify-start pt-1.5' : 'h-9 justify-center',
                'hover:bg-accent hover:text-accent-foreground',
                isTodayDate && 'bg-accent text-accent-foreground',
                isSelected &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                isOtherMonth && 'text-muted-foreground opacity-50',
                isDisabled &&
                  'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-inherit',
              )}
            >
              <span>{date.getDate()}</span>
              {renderDayContent && (
                <div className="mt-0.5 flex h-2 items-center gap-0.5">
                  {renderDayContent(date)}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.Header = CalendarHeader
Calendar.PrevButton = CalendarPrevButton
Calendar.NextButton = CalendarNextButton
Calendar.MonthYearSelect = CalendarMonthYearSelect
Calendar.Grid = CalendarGrid
