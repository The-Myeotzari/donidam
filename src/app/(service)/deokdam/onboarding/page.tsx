'use client'

import { ROUTES } from '@/shared/constants/route'
import { Button } from '@/shared/ui/Button'
import cn from '@/shared/lib/cn'
import { Users, Baby } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Role = 'parent' | 'child'

export default function DeokdamOnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Role | null>(null)

  const handleNext = () => {
    if (!selected) return
    if (selected === 'parent') {
      router.push(ROUTES.deokdamParentInvite)
    } else {
      router.push(ROUTES.deokdamChildAccept)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-200px)]">
      <p className="mt-4 mb-6 text-sm font-medium">어떤 역할로 사용하시나요?</p>

      <div className="grid grid-cols-2 gap-3">
        <RoleCard
          icon={<Users size={32} className="text-rose-400" />}
          title="부모 / 보호자"
          description={`자녀에게 용돈을 보내고\n약속을 관리해요`}
          selected={selected === 'parent'}
          onClick={() => setSelected('parent')}
        />
        <RoleCard
          icon={<Baby size={32} className="text-primary" />}
          title="자녀"
          description={`용돈을 받고\n약속을 만들어요`}
          selected={selected === 'child'}
          onClick={() => setSelected('child')}
        />
      </div>

      <div className="mt-auto pt-6">
        <Button
          fullWidth
          size="xl"
          variant="primary"
          disabled={!selected}
          onClick={handleNext}
          rightIcon={<span>→</span>}
        >
          다음
        </Button>
      </div>
    </div>
  )
}

type RoleCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

function RoleCard({ icon, title, description, selected, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center shadow-sm transition-all',
        selected ? 'ring-2 ring-primary' : 'ring-1 ring-transparent',
      )}
    >
      {icon}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground whitespace-pre-line">{description}</p>
      </div>
    </button>
  )
}
