import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/shared/ui/Tabs'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof TabsRoot> = {
  title: 'ui-kit/Tabs',
  component: TabsRoot,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
  },
  // variant를 스토리북 Control에서 직접 조절할 수 있게 설정
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['box', 'capsule'],
      description: '탭의 디자인 시스템 버전을 선택합니다.',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TabsRoot>

/**
 * 기본 박스(Box) 형태의 탭입니다. (Shadcn UI 스타일)
 * 주로 대분류 메뉴나 꽉 찬 너비의 레이아웃에 사용됩니다.
 */
export const BoxVariant: Story = {
  args: {
    variant: 'box',
    defaultValue: 'all',
    children: (
      <>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="income">수입</TabsTrigger>
          <TabsTrigger value="expense">지출</TabsTrigger>
        </TabsList>
        <TabsContent value="all">전체 내역이 표시됩니다.</TabsContent>
        <TabsContent value="income">수입 내역만 표시됩니다.</TabsContent>
        <TabsContent value="expense">지출 내역만 표시됩니다.</TabsContent>
      </>
    ),
  },
}

/**
 * 캡슐(Capsule) 형태의 탭입니다.
 * 필터링 버튼처럼 독립적인 요소로 보여야 할 때 사용하기 적합합니다.
 */
export const CapsuleVariant: Story = {
  args: {
    variant: 'capsule',
    defaultValue: 'ongoing',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="ongoing">진행중</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
          <TabsTrigger value="canceled">취소됨</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="mt-4 p-4 text-muted-foreground">
          현재 진행 중인 프로젝트입니다.
        </TabsContent>
        <TabsContent value="completed" className="mt-4 p-4 text-muted-foreground">
          완료된 프로젝트 목록입니다.
        </TabsContent>
        <TabsContent value="canceled" className="mt-4 p-4 text-muted-foreground">
          취소된 항목들이 표시됩니다.
        </TabsContent>
      </>
    ),
  },
}
