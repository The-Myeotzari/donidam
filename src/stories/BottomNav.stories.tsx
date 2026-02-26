import { BottomNav } from '@/shared/ui/BottomNav'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof BottomNav> = {
  title: 'ui-kit/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'usePathname 기반으로 현재 경로를 자동 감지하여 active 탭을 표시하는 하단 네비게이션 바입니다. max-w-107.5 mx-auto로 너비가 제한됩니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-24 bg-background border border-border rounded-2xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Home: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/' } },
  },
}

