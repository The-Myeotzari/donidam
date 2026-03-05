'use client'

import { SafeIntegrationCard } from '@/widgets/autofill-settings/ui/SafeIntegrationCard'
import { AutofillToggleSection } from '@/widgets/autofill-settings/ui/AutofillToggleSection'
import { ConnectedAccountsSection } from '@/widgets/autofill-settings/ui/ConnectedAccountsSection'
import { AddAccountCta } from '@/widgets/autofill-settings/ui/AddAcountCta'
import { useAutofillSettingsVM } from '@/widgets/autofill-settings/model/useAutofillSettingsVM'
import { BottomNav } from '@/shared/layout/BottomNav'

export default function AutoFillPage() {
  const { isEnabled, connectedAccounts, isLoading, onToggle, onAccountClick } =
    useAutofillSettingsVM() as ReturnType<typeof useAutofillSettingsVM> & {
      onAccountClick?: (id: string) => void
    }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-107.5 mx-auto pb-24">
        {/* Header */}
        
        {/* Content */}
        <div className="px-2 flex flex-col gap-4">
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
