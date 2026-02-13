import { Toggle } from '@/shared/ui/Toggle'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

const meta: Meta<typeof Toggle> = {
  title: 'ui-kit/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compound Component 패턴을 기반으로 하며, props를 통한 간편 설정과 자유로운 레이아웃 구성을 모두 지원하는 접근성 준수 토글 컴포넌트입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-30 bg-[--background] p-10">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Toggle>

// 간편형 (Props Label - Right)
export const SimpleRight: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Toggle
        label="푸시 알림 수신"
        labelPosition="right"
        labelable={true}
        checked={checked}
        onCheckedChange={setChecked}
      />
    )
  },
}

// 라벨 왼쪽 배치 (Props Label - Left)
export const SimpleLeft: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <Toggle
        label="마케팅 정보 동의 (왼쪽)"
        labelPosition="left"
        labelable={true}
        checked={checked}
        onCheckedChange={setChecked}
      />
    )
  },
}

// Switch Only
export const SwitchOnly: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Toggle label="푸시 알림 수신" checked={checked} onCheckedChange={setChecked} />
  },
}

// 커스텀형
export const CustomCompound: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <Toggle label="푸시 알림 수신" checked={checked} onCheckedChange={setChecked}>
        <Toggle.Label className="text-primary font-bold underline decoration-2 underline-offset-4">
          커스텀 스타일 라벨
        </Toggle.Label>
        <Toggle.Track>
          <Toggle.Thumb />
        </Toggle.Track>
      </Toggle>
    )
  },
}

// 비활성화 (Disabled)
export const Disabled: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <Toggle
          label="비활성화 (Off)"
          labelable={true}
          checked={false}
          onCheckedChange={() => {}}
          disabled
        />
        <Toggle
          label="비활성화 (On)"
          labelable={true}
          checked={true}
          onCheckedChange={() => {}}
          disabled
        />
      </div>
    )
  },
}
