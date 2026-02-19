import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '@/shared/ui/ToolTip'

const meta: Meta<typeof Tooltip> = {
  title: 'Shared/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    delayDuration: {
      control: { type: 'number' },
      description: '툴팁이 나타나기까지의 지연 시간 (ms)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '툴팁 활성화 여부',
    },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>


export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
        마우스를 올려보세요
      </Tooltip.Trigger>
      <Tooltip.Content side="top">기본 툴팁 메시지</Tooltip.Content>
    </Tooltip>
  ),
}


export const Directions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip>
        <Tooltip.Trigger className="border p-2">Top</Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={8}>
          Top Content
        </Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger className="border p-2">Bottom</Tooltip.Trigger>
        <Tooltip.Content side="bottom" sideOffset={8}>
          Bottom Content
        </Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger className="border p-2">Left</Tooltip.Trigger>
        <Tooltip.Content side="left" sideOffset={8}>
          Left Content
        </Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger className="border p-2">Right</Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={8}>
          Right Content
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}


export const Immediate: Story = {
  args: {
    delayDuration: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger className="border p-2">즉시 실행</Tooltip.Trigger>
      <Tooltip.Content>지연 시간 없이 바로 나타난다</Tooltip.Content>
    </Tooltip>
  ),
}

export const AsChild: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <span className="cursor-help font-bold text-blue-500 underline">텍스트 트리거 </span>
      </Tooltip.Trigger>
      <Tooltip.Content>asChild를 사용하면 버튼 대신 다른 태그를 쓸 수 있다</Tooltip.Content>
    </Tooltip>
  ),
}


export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger className="border p-2 text-gray-400">비활성화 상태</Tooltip.Trigger>
      <Tooltip.Content>이 내용은 보이지 않아야 한다</Tooltip.Content>
    </Tooltip>
  ),
}
