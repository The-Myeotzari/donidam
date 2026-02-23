import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Badge } from "@/shared/ui/Badge"
import { Calendar, Loader2, X } from "lucide-react"

const meta: Meta<typeof Badge> = {
  title: "ui-kit/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["sky", "green", "gray", "yellow", "red", "primarySoft"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
    },
    onClick: { action: "clicked" },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/* Playground (Controls용) */

export const Playground: Story = {
  args: {
    variant: "sky",
    size: "sm",
  },
  render: (args) => (
    <Badge {...args}>
      <Badge.Text>Playground</Badge.Text>
    </Badge>
  ),
}

/* Status Pills (실사용 예시) */

export const StatusPills: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge size="xs" variant="sky">
        <Badge.Text>진행중</Badge.Text>
      </Badge>

      <Badge size="xs" variant="green">
        <Badge.Text>달성</Badge.Text>
      </Badge>

      <Badge size="xs" variant="gray">
        <Badge.Text>완료</Badge.Text>
      </Badge>
    </div>
  ),
}

/* Filter Chip (Calendar + X) */

export const FilterChip: Story = {
  render: () => (
    <Badge variant="primarySoft" size="md">
      <Badge.LeftIcon>
        <Calendar size={12} />
      </Badge.LeftIcon>

      <Badge.Text>3/18 - 3/20</Badge.Text>

      <Badge.Action
        aria-label="날짜 필터 제거"
        onClick={() => alert("필터 제거")}
        className="hover:bg-primary/20 p-0.5"
      >
        <X size={12} />
      </Badge.Action>
    </Badge>
  ),
}

/* Clickable Badge */

export const Clickable: Story = {
  args: {
    variant: "yellow",
    size: "sm",
  },
  render: (args) => (
    <Badge {...args}>
      <Badge.LeftIcon>
        <Loader2 size={12} className="animate-spin" />
      </Badge.LeftIcon>
      <Badge.Text>로딩중</Badge.Text>
    </Badge>
  ),
}

/* Size Variants */

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="xs" variant="sky">
        <Badge.Text>XS</Badge.Text>
      </Badge>

      <Badge size="sm" variant="sky">
        <Badge.Text>SM</Badge.Text>
      </Badge>

      <Badge size="md" variant="sky">
        <Badge.Text>MD</Badge.Text>
      </Badge>
    </div>
  ),
}

/* All Variants */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="sky"><Badge.Text>Sky</Badge.Text></Badge>
      <Badge variant="green"><Badge.Text>Green</Badge.Text></Badge>
      <Badge variant="gray"><Badge.Text>Gray</Badge.Text></Badge>
      <Badge variant="yellow"><Badge.Text>Yellow</Badge.Text></Badge>
      <Badge variant="red"><Badge.Text>Red</Badge.Text></Badge>
      <Badge variant="primarySoft"><Badge.Text>PrimarySoft</Badge.Text></Badge>
    </div>
  ),
}
