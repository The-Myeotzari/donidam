import { ButtomSheet } from '@/shared/ui/ButtomSheet'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { X } from 'lucide-react'
import { useState } from 'react'

const meta: Meta<typeof ButtomSheet> = {
  title: 'ui-kit/ButtomSheet',
  component: ButtomSheet,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
}
export default meta
type Story = StoryObj<typeof ButtomSheet>

export const Default: Story = {
  name: '1. 필터 선택형 (X 버튼)',
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-foreground text-background rounded-xl font-medium"
        >
          필터 시트 열기
        </button>

        <ButtomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ButtomSheet.Header className="">
            <span className="text-xl font-bold">조회 조건 설정</span>
            <ButtomSheet.Close>
              <button aria-label="닫기">
                <X size={24} />
              </button>
            </ButtomSheet.Close>
          </ButtomSheet.Header>

          <ButtomSheet.Content>
            <div className="space-y-6 py-4">
              <p>원하시는 조회 기간과 카테고리를 선택해주세요.</p>
              <div className="h-40 bg-muted/20 border-2 border-dashed">필터 옵션 영역</div>
            </div>
          </ButtomSheet.Content>

          <div className="mt-8">
            <button onClick={() => setIsOpen(false)}>12개 결과 보기</button>
          </div>
        </ButtomSheet>
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border border-border rounded-xl font-medium"
        >
          긴 컨텐츠 보기
        </button>

        <ButtomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ButtomSheet.Header>스크롤 확인</ButtomSheet.Header>

          <ButtomSheet.Content className="max-h-[50vh]">
            <div className="space-y-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg">
                  항목 {i + 1}에 대한 상세 내용입니다.
                </div>
              ))}
            </div>
          </ButtomSheet.Content>

          <div className="mt-4">
            <ButtomSheet.Close>
              <button className="w-full py-3 bg-foreground text-background rounded-xl font-medium">
                닫기
              </button>
            </ButtomSheet.Close>
          </div>
        </ButtomSheet>
      </div>
    )
  },
}
