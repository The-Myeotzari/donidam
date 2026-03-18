import { ToastItem, ToastProvider, useToast } from '@/app/_providers/ToastProvier'
import { ToastRoot } from '@/shared/ui/Toast'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

// 테스트용 버튼 컴포넌트
type ToastSceneProps = Omit<ToastItem, 'id'>
const ToastScene = ({
  type = 'info',
  title = '알림',
  description = '내용입니다.',
  duration = 3000,
}: ToastSceneProps) => {
  const { addToast } = useToast()

  return (
    <button
      onClick={() => addToast({ type, title, description, duration })}
      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      토스트 띄우기 ({type})
    </button>
  )
}

const meta: Meta<typeof ToastRoot> = {
  title: 'ui-kit/Toast',
  component: ToastRoot,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="flex items-center justify-center min-h-50">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ToastRoot>

// 성공(Success) 상태
export const Success: Story = {
  render: () => (
    <ToastScene
      type="success"
      title="송금 완료"
      description="김철수님에게 10,000원이 전달되었습니다."
    />
  ),
}

// 에러(Error) 상태
export const Error: Story = {
  render: () => (
    <ToastScene
      type="error"
      title="잔액 부족"
      description="계좌의 잔액이 부족하여 송금에 실패했습니다."
    />
  ),
}

// 정보(Info) 및 경고(Warning) 상태
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ToastScene type="info" title="안내" description="새로운 보안 업데이트가 있습니다." />
      <ToastScene type="warning" title="경고" description="비밀번호 유효기간이 만료 예정입니다." />
    </div>
  ),
}

// 커스텀 듀레이션이 적용된 토스트 예시
export const LongDuration: Story = {
  render: () => (
    <ToastScene
      type="info"
      title="장기 알림"
      description="이 토스트는 10초 동안 유지됩니다."
      duration={10000}
    />
  ),
}
