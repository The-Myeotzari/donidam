import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Calendar } from '@/shared/ui/Calendar'
import { useState } from 'react'

const meta: Meta<typeof Calendar> = {
  title: 'Shared/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date())

    return (
      <Calendar value={date} onChange={setDate}>
        <Calendar.Header>
          <Calendar.PrevButton />
          <Calendar.MonthYearSelect />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar>
    )
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <Calendar defaultValue={new Date()}>
      <Calendar.Header>
        <Calendar.PrevButton />
        <Calendar.MonthYearSelect />
        <Calendar.NextButton />
      </Calendar.Header>
      <Calendar.Grid />
    </Calendar>
  ),
}

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)

    // 과거 날짜 비활성화
    const isDateDisabled = (date: Date) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date < today
    }

    return (
      <Calendar value={date} onChange={setDate} isDateDisabled={isDateDisabled}>
        <Calendar.Header>
          <Calendar.PrevButton />
          <Calendar.MonthYearSelect />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar>
    )
  },
}

export const WithCallback: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date())
    const [selected, setSelected] = useState('')

    const handleChange = (newDate: Date) => {
      setDate(newDate)
      setSelected(newDate.toLocaleDateString('ko-KR'))
    }

    return (
      <div className="space-y-4">
        <Calendar value={date} onChange={handleChange}>
          <Calendar.Header>
            <Calendar.PrevButton />
            <Calendar.MonthYearSelect />
            <Calendar.NextButton />
          </Calendar.Header>
          <Calendar.Grid />
        </Calendar>
        {selected && <p className="text-center text-sm text-gray-600">선택된 날짜: {selected}</p>}
      </div>
    )
  },
}

export const CustomStyling: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date())

    return (
      <Calendar value={date} onChange={setDate} className="bg-gray-50 shadow-lg">
        <Calendar.Header className="border-b pb-4">
          <Calendar.PrevButton className="text-blue-600" />
          <Calendar.MonthYearSelect className="text-2xl text-blue-900" />
          <Calendar.NextButton className="text-blue-600" />
        </Calendar.Header>
        <Calendar.Grid className="mt-6" />
      </Calendar>
    )
  },
}
