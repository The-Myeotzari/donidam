import type { AutofillSettings } from '../model/autofill.types'

export async function getAutofillSettings(): Promise<AutofillSettings> {
  // TODO: 실제 API 연동
  return {
    isEnabled: true,
    connectedAccounts: [
      {
        id: '1',
        bankName: '국민은행',
        bankCode: 'kb',
        lastSyncedAt: '방금 전',
        status: 'connected',
      },
      {
        id: '2',
        bankName: '카카오뱅크',
        bankCode: 'kakao',
        status: 'syncing',
      },
      {
        id: '3',
        bankName: '신한은행',
        bankCode: 'shinhan',
        lastSyncedAt: '5분 전',
        status: 'connected',
      },
    ],
  }
}
