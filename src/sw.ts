import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, StaleWhileRevalidate } from 'serwist'

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/fonts\.googleapis\.com/,
      handler: new StaleWhileRevalidate(),
    },
  ],
})

serwist.addEventListeners()

// ─── 웹 푸시 알림 핸들러 ───────────────────────────────────────────

interface PushPayload {
  title: string
  body: string
  data?: {
    deepLink?: string
  }
}

// Serwist의 타입 선언과 분리하여 네이티브 SW 이벤트 등록
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swSelf = self as any

swSelf.addEventListener('push', (event: { data: { json: () => unknown; text: () => string } | null; waitUntil: (p: Promise<unknown>) => void }) => {
  if (!event.data) return

  let payload: PushPayload
  try {
    payload = event.data.json() as PushPayload
  } catch {
    payload = { title: '돈이담', body: event.data.text() }
  }

  event.waitUntil(
    (swSelf.registration as ServiceWorkerRegistration).showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { deepLink: payload.data?.deepLink ?? '/' },
    }),
  )
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
swSelf.addEventListener('notificationclick', (event: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  event.notification.close()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const deepLink: string = (event.notification.data?.deepLink as string) ?? '/'

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  event.waitUntil(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    swSelf.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((clientList: any[]) => {
        for (const client of clientList) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if ('navigate' in client) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            return client.navigate(deepLink).then((c: { focus: () => void } | null) => c?.focus())
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return swSelf.clients.openWindow(deepLink)
      }),
  )
})
