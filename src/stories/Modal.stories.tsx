import { Modal } from '@/shared/ui/Modal'
import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

const meta: Meta<typeof Modal> = {
  title: 'ui-kit/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달의 표시 여부를 결정합니다.',
    },
    onClose: {
      action: 'closed',
      description: '모달을 닫을 때 호출되는 함수입니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

// 기본 모달 (상태 제어 포함)
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen)

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-xl font-bold"
        >
          모달 열기
        </button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            args.onClose()
          }}
        >
          <Modal.Header>알림</Modal.Header>
          <Modal.Content>
            <p>이모달입니다.</p>
          </Modal.Content>
          <Modal.Footer>
            <button onClick={() => setIsOpen(false)}>확인</button>
          </Modal.Footer>
        </Modal>
      </>
    )
  },
  args: {
    isOpen: false,
  },
}
