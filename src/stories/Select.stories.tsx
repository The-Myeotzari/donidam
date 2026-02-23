import { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'

import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectDescription,
  SelectMessage,
} from '@/shared/ui/Select'

const meta: Meta = {
  title: 'shared/Select',
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof meta>

/* Default */

export const Default: Story = {
  render: () => (
    <div className="w-[320px]">
      <SelectRoot placeholder="과목 선택">
        <SelectTrigger aria-label="과목 선택">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="math">수학</SelectItem>
          <SelectItem value="eng">영어</SelectItem>
          <SelectItem value="cs">컴퓨터</SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
}

/* Sizes */

export const Sizes: Story = {
  render: () => (
    <div className="w-[320px] space-y-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SelectRoot key={size} size={size} placeholder={`${size.toUpperCase()} 선택`}>
          <SelectTrigger aria-label={`${size} 사이즈`}>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="a">옵션 A</SelectItem>
            <SelectItem value="b">옵션 B</SelectItem>
            <SelectItem value="c">옵션 C</SelectItem>
          </SelectContent>
        </SelectRoot>
      ))}
    </div>
  ),
}

/* With Description */

export const WithDescription: Story = {
  render: () => (
    <div className="w-[320px]">
      <SelectRoot placeholder="카테고리 선택">
        <SelectTrigger aria-label="카테고리 선택">
          <SelectValue />
        </SelectTrigger>

        <SelectDescription>
          거래 분류에 사용됩니다.
        </SelectDescription>

        <SelectContent>
          <SelectItem value="food">식비</SelectItem>
          <SelectItem value="transport">교통</SelectItem>
          <SelectItem value="shopping">쇼핑</SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
}

/* With Message */

export const WithMessage: Story = {
  render: () => (
    <div className="w-[320px]">
      <SelectRoot placeholder="은행 선택">
        <SelectTrigger aria-label="은행 선택">
          <SelectValue />
        </SelectTrigger>

        <SelectMessage>
          은행 선택은 필수입니다.
        </SelectMessage>

        <SelectContent>
          <SelectItem value="kb">국민</SelectItem>
          <SelectItem value="shinhan">신한</SelectItem>
          <SelectItem value="woori">우리</SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
}

/* Controlled */

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('eng')

    return (
      <div className="w-[320px] space-y-2">
        <SelectRoot value={value} onValueChange={setValue}>
          <SelectTrigger aria-label="제어형 Select">
            <SelectValue placeholder="선택" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="math">수학</SelectItem>
            <SelectItem value="eng">영어</SelectItem>
            <SelectItem value="cs">컴퓨터</SelectItem>
          </SelectContent>
        </SelectRoot>

        <p className="text-xs text-muted-foreground px-2">
          선택값: {value}
        </p>
      </div>
    )
  },
}

/* Group & Separator */

export const GroupAndSeparator: Story = {
  render: () => (
    <div className="w-[320px]">
      <SelectRoot placeholder="지역 선택">
        <SelectTrigger aria-label="지역 선택">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>수도권</SelectLabel>
            <SelectItem value="seoul">서울</SelectItem>
            <SelectItem value="incheon">인천</SelectItem>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectLabel>영남</SelectLabel>
            <SelectItem value="busan">부산</SelectItem>
            <SelectItem value="daegu">대구</SelectItem>
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
}

/* Scrollable */

export const Scrollable: Story = {
  render: () => (
    <div className="w-[320px]">
      <SelectRoot placeholder="아이템 선택">
        <SelectTrigger aria-label="스크롤 Select">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {Array.from({ length: 30 }).map((_, i) => (
            <SelectItem key={i} value={`item-${i}`}>
              아이템 {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  ),
}
