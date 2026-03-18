import { BottomSheet } from '@/shared/ui/BottomSheet'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { X } from 'lucide-react'
import { useState } from 'react'

const meta: Meta<typeof BottomSheet> = {
  title: 'ui-kit/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
}
export default meta
type Story = StoryObj<typeof BottomSheet>

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

        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <BottomSheet.Header className="">
            <span className="text-xl font-bold">조회 조건 설정</span>
            <BottomSheet.Close>
              <button aria-label="닫기">
                <X size={24} />
              </button>
            </BottomSheet.Close>
          </BottomSheet.Header>

          <BottomSheet.Content>
            <div className="space-y-6 py-4">
              <p>원하시는 조회 기간과 카테고리를 선택해주세요.</p>
              <div className="h-40 bg-muted/20 border-2 border-dashed">필터 옵션 영역</div>
            </div>
          </BottomSheet.Content>

          <div className="mt-8">
            <button onClick={() => setIsOpen(false)}>12개 결과 보기</button>
          </div>
        </BottomSheet>
      </div>
    )
  },
}

export const LongContent: Story = {
  name: '2. 긴 컨텐츠',
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

        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <BottomSheet.Header>스크롤 확인</BottomSheet.Header>

          <BottomSheet.Content className="max-h-[50vh]">
            <div className="space-y-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg">
                  항목 {i + 1}에 대한 상세 내용입니다.
                </div>
              ))}
            </div>
          </BottomSheet.Content>

          <div className="mt-4">
            <BottomSheet.Close>
              <button className="w-full py-3 bg-foreground text-background rounded-xl font-medium">
                닫기
              </button>
            </BottomSheet.Close>
          </div>
        </BottomSheet>
      </div>
    )
  },
}
