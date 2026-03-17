// 돈이담 서비스 워커 - Web Push 알림 처리

self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const { title, body, icon, badge, data: notifData } = data

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon ?? '/icons/icon-192x192.png',
      badge: badge ?? '/icons/badge-72x72.png',
      data: notifData ?? {},
      vibrate: [200, 100, 200],
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const deepLink = event.notification.data?.deepLink ?? '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(deepLink)
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(deepLink)
        }
      }),
  )
})
