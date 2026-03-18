'use client'

import { Toggle } from '@/shared/ui/Toggle'
import { Settings } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Api } from '@/shared/lib/api/api'
import { z } from 'zod'
import { QUERY_KEYS } from '@/shared/constants/queryKey'

const AutoSettingsSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      enabled: z.boolean(),
      nextPayDay: z.number().nullable(),
      totalAmount: z.number(),
      childNames: z.array(z.string()),
    }),
  })
  .transform((v) => v.data)

const ToggleResultSchema = z.object({ ok: z.literal(true) })

export function ParentAutoAllowanceCard() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.autoSettings,
    queryFn: () => Api.get('/deokdam/parent/auto-settings', AutoSettingsSchema),
    staleTime: 1000 * 60,
  })

  const { mutate: toggleEnabled } = useMutation({
    mutationFn: (enabled: boolean) =>
      Api.patch('/deokdam/parent/auto-settings', ToggleResultSchema, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEOKDAM.autoSettings })
    },
  })

  const enabled = data?.enabled ?? false
  const nextPayDay = data?.nextPayDay
  const totalAmount = data?.totalAmount ?? 0
  const childNames = data?.childNames ?? []

  const nextPayLabel = nextPayDay
    ? `다음 지급일: ${new Date().getMonth() + 1}월 ${nextPayDay}일`
    : '자동 지급일 미설정'

  const childNamesLabel =
    childNames.length > 0 ? childNames.join(', ') + '에게' : '자녀에게'

  const amountLabel = totalAmount.toLocaleString('ko-KR') + '원'

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">자동 덕담 설정</p>
          <p className="text-xs text-muted-foreground mt-0.5">{nextPayLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <Toggle
            checked={enabled}
            onCheckedChange={toggleEnabled}
            label="자동 덕담 설정"
          />
          <button type="button" aria-label="자동 덕담 설정 관리">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {enabled && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">매월 {childNamesLabel}</p>
            <p className="text-base font-semibold">{amountLabel}</p>
          </div>
          <button type="button" className="text-sm text-muted-foreground">
            수정 &gt;
          </button>
        </div>
      )}
    </div>
  )
}
