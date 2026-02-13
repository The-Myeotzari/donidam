import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { Input } from '@/shared/ui/Input'

const meta: Meta<typeof Input> = {
  title: 'ui-kit/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'error'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    className: { control: false },
    children: { control: false },
  },
  args: {
    variant: 'default',
    size: 'md',
  },
}

export default meta
type Story = StoryObj<typeof Input>

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 360 }}>{children}</div>
)

/* 기본 */
export const Default: Story = {
  render: (args) => (
    <Wrap>
      <Input {...args}>
        <Input.Field placeholder="입력해보세요" />
      </Input>
    </Wrap>
  ),
}

/* 메세지 포함 */
export const WithMessage: Story = {
  render: (args) => (
    <Wrap>
      <Input {...args}>
        <Input.Field placeholder="이메일" />
        <Input.Message>helper message</Input.Message>
      </Input>
    </Wrap>
  ),
}

/* 에러 상태 */
export const Error: Story = {
  args: { variant: 'error' },
  render: (args) => (
    <Wrap>
      <Input {...args}>
        <Input.Field placeholder="이메일" defaultValue="wrong@email" />
        <Input.Message>올바른 이메일 형식이 아닙니다.</Input.Message>
      </Input>
    </Wrap>
  ),
}

/* 우측 아이콘 */
export const WithRightIcon: Story = {
  render: (args) => (
    <Wrap>
      <Input {...args}>
        <div className="relative">
          <Input.Field placeholder="검색" className="pr-10" />
          <Input.Icon>🔍</Input.Icon>
        </div>
      </Input>
    </Wrap>
  ),
}

/* 비밀번호 토글 */
export const Password: Story = {
  render: (args) => (
    <Wrap>
      <Input {...args}>
        <div className="relative">
          <Input.Field type="password" placeholder="비밀번호" className="pr-12" />
          <Input.InputPasswordToggle />
        </div>
        <Input.Message>8자 이상 입력하세요.</Input.Message>
      </Input>
    </Wrap>
  ),
}

/* Disabled */
export const Disabled: Story = {
  render: (args) => (
    <Wrap>
      <Input {...args}>
        <Input.Field placeholder="비활성" disabled />
        <Input.Message>disabled 상태</Input.Message>
      </Input>
    </Wrap>
  ),
}

/* 사이즈 샘플 */
export const Sizes: Story = {
  render: () => (
    <div style={{ width: 360 }} className="space-y-4">
      <Input size="sm">
        <Input.Field placeholder="sm" />
      </Input>

      <Input size="md">
        <Input.Field placeholder="md" />
      </Input>

      <Input size="lg">
        <Input.Field placeholder="lg" />
      </Input>
    </div>
  ),
}

/* Variants 샘플 */
export const Variants: Story = {
  render: () => (
    <div style={{ width: 360 }} className="space-y-4">
      <Input variant="default">
        <Input.Field placeholder="default" />
        <Input.Message>기본 안내 메세지</Input.Message>
      </Input>

      <Input variant="error">
        <Input.Field placeholder="error" defaultValue="invalid" />
        <Input.Message>에러 메세지</Input.Message>
      </Input>
    </div>
  ),
}
