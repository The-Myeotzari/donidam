import { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/ui/Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'ui-kit/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: '아코디언의 동작 방식을 결정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: '아코디언 비활성화 여부를 결정합니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  args: {
    type: 'single',
    className: 'w-[500px]',
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>사용 방법이 어떻게 되나요?</AccordionTrigger>
        <AccordionContent>
          Accordion 내부에 Item, Trigger, Content를 순서대로 배치하여 사용합니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>FSD 아키텍처를 따르나요?</AccordionTrigger>
        <AccordionContent>
          네, shared 레이어에 위치하여 프로젝트 전반에서 공통으로 사용됩니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>커스터마이징이 가능한가요?</AccordionTrigger>
        <AccordionContent>
          네, className을 통해 스타일을 자유롭게 커스터마이징할 수 있습니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1'],
    className: 'w-[500px]',
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>첫 번째 항목</AccordionTrigger>
        <AccordionContent>여러 개의 아코디언을 동시에 열 수 있습니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>두 번째 항목</AccordionTrigger>
        <AccordionContent>type을 멀티플로 설정하면 다중 선택이 가능합니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>세 번째 항목</AccordionTrigger>
        <AccordionContent>
          defaultValue로 기본적으로 열려있는 항목을 지정할 수 있습니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Disabled: Story = {
  args: {
    type: 'single',
    disabled: true,
    className: 'w-[500px]',
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>비활성화된 아코디언</AccordionTrigger>
        <AccordionContent>
          disabled 속성을 true로 설정하면 아코디언을 열 수 없습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>클릭할 수 없습니다</AccordionTrigger>
        <AccordionContent>모든 아이템이 비활성화 상태입니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
