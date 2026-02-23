import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/shared/ui/Button'
import { Plus, TrendingUp, Target } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'ui-kit/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'dashed'],
      description: '버튼의 시각적 스타일을 결정한다.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '버튼의 크기를 결정한다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: '수입 추가',
    leftIcon: <TrendingUp className="h-5 w-5" />,
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: '지출 추가',
    leftIcon: <Plus className="h-5 w-5" />,
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    children: '이번달 예산',
    leftIcon: <Target className="h-5 w-5" />,
  },
}

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    size: 'lg',
    children: '다른 금융사 추가하기',
    leftIcon: <Plus className="h-5 w-5" />,
    fullWidth: true,
    className: 'w-[500px]',
  },
}

export const TabButtons: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="secondary" size="md" leftIcon={<Plus className="h-5 w-5" />}>
        지출 추가
      </Button>
      <Button variant="primary" size="md" leftIcon={<TrendingUp className="h-5 w-5" />}>
        수입 추가
      </Button>
      <Button variant="outline" size="md" leftIcon={<Target className="h-5 w-5" />}>
        이번달 예산
      </Button>
    </div>
  ),
}

export const BottomActions: Story = {
  render: () => (
    <div className="flex gap-3 w-[500px]">
      <Button variant="secondary" size="lg" fullWidth>
        이전
      </Button>
      <Button variant="primary" size="lg" fullWidth>
        시작하기
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: '처리중...',
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: '비활성화',
    disabled: true,
  },
}
