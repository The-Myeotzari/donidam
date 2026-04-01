import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
} from '@/shared/constants/transactionCategory'
import cn from '@/shared/lib/cn'

type Props = {
  selected: string[]
  onToggle: (cat: string) => void
}

export function CategorySelect({ selected, onToggle }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3">카테고리</p>
      <div className="flex flex-wrap gap-2">
        {EXPENSE_CATEGORIES.map((cat) => {
          const Icon = EXPENSE_CATEGORY_ICON[cat]
          const theme = EXPENSE_CATEGORY_THEME[cat]
          const isSelected = selected.includes(cat)

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onToggle(cat)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
                isSelected
                  ? `${theme.bg} ${theme.icon} border-2 border-current font-semibold`
                  : 'bg-muted text-muted-foreground border border-transparent',
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center',
                  isSelected ? 'bg-white/60' : theme.bg,
                )}
              >
                <Icon size={11} className={theme.icon} />
              </div>
              {EXPENSE_CATEGORY_LABEL[cat]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
