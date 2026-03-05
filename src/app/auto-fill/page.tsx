'use client'

import { SafeIntegrationCard } from '@/widgets/autofill-settings/ui/SafeIntegrationCard'
import { AutofillToggleSection } from '@/widgets/autofill-settings/ui/AutofillToggleSection'
import { ConnectedAccountsSection } from '@/widgets/autofill-settings/ui/ConnectedAccountsSection'
import { AddAccountCta } from '@/widgets/autofill-settings/ui/AddAcountCta'
import { useAutofillSettingsVM } from '@/widgets/autofill-settings/model/useAutofillSettingsVM'
import { BottomNav } from '@/shared/ui/BottomNav'

export default function AutoFillPage() {
  const { isEnabled, connectedAccounts, isLoading, onToggle, onAccountClick } =
    useAutofillSettingsVM() as ReturnType<typeof useAutofillSettingsVM> & {
      onAccountClick?: (id: string) => void
    }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-107.5 mx-auto pb-24">
        {/* Header */}
        <header className="px-5 pt-14 pb-6">
          <h1 className="text-2xl font-bold text-foreground">자동 기입</h1>
          <p className="text-sm text-muted-foreground mt-1">
            은행 계좌를 연결하고 자동으로 가계부를 작성하세요
          </p>
        </header>

        {/* Content */}
        <div className="px-4 flex flex-col gap-4">
          <SafeIntegrationCard />

          {!isLoading && (
            <AutofillToggleSection isEnabled={isEnabled} onToggle={onToggle} />
          )}

          {!isLoading && connectedAccounts.length > 0 && (
            <ConnectedAccountsSection
              accounts={connectedAccounts}
              onAccountClick={onAccountClick}
            />
          )}

          <AddAccountCta />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
