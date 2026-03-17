export type PromiseStatus =
  | 'IN_PROGRESS'
  | 'PENDING_APPROVAL'
  | 'ACHIEVED'
  | 'APPROVED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED'

export type AllowanceType = 'manual' | 'reward'

export type ParentSummary = {
  totalThisMonth: number
  totalPrevMonth: number
  changeAmount: number
  childCount: number
}

export type PromiseItem = {
  id: number
  title: string
  category: string
  childId: string
  childName: string
  reward: number
  status: PromiseStatus
  dueDate: string | null
  message: string | null
  createdAt: string
}

export type AllowanceItem = {
  id: number
  senderId: string
  receiverId: string
  childName: string
  amount: number
  message: string | null
  type: AllowanceType
  createdAt: string
}
