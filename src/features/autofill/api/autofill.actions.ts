'use server'

export async function toggleAutofill(_enabled: boolean): Promise<void> {
  // TODO: DB 업데이트
}

export async function syncAccount(_accountId: string): Promise<void> {
  // TODO: 동기화 트리거
}

export async function disconnectAccount(_accountId: string): Promise<void> {
  // TODO: 계좌 연결 해제
}
