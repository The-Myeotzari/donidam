'use client'

import { useTheme } from '@/app/_providers/ThemeContext'
import cn from '@/shared/lib/cn'
import { Card } from '@/shared/ui/Card'
import { Monitor, Moon, Sun } from 'lucide-react'

const themeOptions = [
  { id: 'light' as const, icon: Sun, label: '라이트 모드', description: '밝은 테마' },
  { id: 'dark' as const, icon: Moon, label: '다크 모드', description: '어두운 테마' },
  { id: 'system' as const, icon: Monitor, label: '시스템 설정', description: '기기 설정을 따름' },
]

export default function ThemePage() {
  const { theme, setTheme } = useTheme()

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isSelected = theme === option.id

          return (
            <button
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl transition-all',
                isSelected
                  ? 'bg-(--primary)/10 border border-(--primary)'
                  : 'bg-(--muted)/50 border-2 border-transparent hover:bg-muted',
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
