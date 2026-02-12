import { Card } from '@/shared/ui/Card'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof Card> = {
  title: 'ui-kit/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'family', 'success'],
      description: '카드의 색상 테마를 결정합니다.',
    },
    layout: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: '카드의 정렬 방향을 결정합니다.',
    },
    hoverable: {
      control: 'boolean',
      description: '호버 애니메이션 적용 여부를 결정합니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

// 기본 카드
export const Default: Story = {
  args: {
    variant: 'default',
    layout: 'vertical',
    hoverable: false,
    className: 'w-[350px]',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>카드 제목</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>가장 기본적인 카드의 형태입니다. 헤더와 본문이 포함되어 있습니다.</p>
      </Card.Content>
      <Card.Footer>
        <button className="w-full py-2 bg-primary text-white rounded-lg">확인</button>
      </Card.Footer>
    </Card>
  ),
}

// 수평 레이아웃 (Horizontal)
export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
    hoverable: true,
    className: 'w-[400px]',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">🏦</div>
      </Card.Header>
      <Card.Content>
        <Card.Title>국민은행</Card.Title>
        <p className="text-xs text-muted-foreground">마지막 동기화: 방금 전</p>
      </Card.Content>
      <Card.Footer>
        <span className="text-primary text-xs font-bold">연결됨</span>
      </Card.Footer>
    </Card>
  ),
}
