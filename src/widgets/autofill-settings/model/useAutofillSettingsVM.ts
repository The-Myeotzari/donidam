'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAutofillSettings } from '@/entities/autofill/api/autofill.queries'
import {
  toggleAutofill,
  syncAccount,
  disconnectAccount,
} from '@/features/autofill/api/autofill.actions'

export function useAutofillSettingsVM() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['autofill-settings'],
    queryFn: getAutofillSettings,
  })

  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) => toggleAutofill(enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['autofill-settings'] }),
  })

  const syncMutation = useMutation({
    mutationFn: (accountId: string) => syncAccount(accountId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['autofill-settings'] }),
  })

  const disconnectMutation = useMutation({
    mutationFn: (accountId: string) => disconnectAccount(accountId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['autofill-settings'] }),
  })

  return {
    isEnabled: data?.isEnabled ?? false,
    connectedAccounts: data?.connectedAccounts ?? [],
    isLoading,
    onToggle: (enabled: boolean) => toggleMutation.mutate(enabled),
    onSync: (accountId: string) => syncMutation.mutate(accountId),
    onDisconnect: (accountId: string) => disconnectMutation.mutate(accountId),
    isSyncingId: syncMutation.isPending ? syncMutation.variables : null,
  }
}
