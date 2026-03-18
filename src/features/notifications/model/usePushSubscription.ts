'use client'

import { useEffect, useState } from 'react'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const buffer = new ArrayBuffer(rawData.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i)
  }
  return buffer
}

export type PushPermission = 'default' | 'granted' | 'denied'

export function usePushSubscription() {
  const [permission, setPermission] = useState<PushPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    setPermission(Notification.permission as PushPermission)

    // 이미 구독 중인지 확인
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub)
      })
    })
  }, [])

  const subscribe = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    setIsLoading(true)
    try {
      // 서비스 워커 등록
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      // 권한 요청
      const perm = await Notification.requestPermission()
      setPermission(perm as PushPermission)
      if (perm !== 'granted') return false

      // 구독 생성
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      const { endpoint, keys } = sub.toJSON() as {
        endpoint: string
        keys: { p256dh: string; auth: string }
      }

      // 서버에 저장
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ endpoint, p256dh: keys.p256dh, auth: keys.auth }),
      })

      setIsSubscribed(true)
      return true
    } catch {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (!sub) return true

      await fetch(
        `/api/notifications/subscribe?endpoint=${encodeURIComponent(sub.endpoint)}`,
        { method: 'DELETE', credentials: 'include' },
      )
      await sub.unsubscribe()
      setIsSubscribed(false)
      return true
    } catch {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const isSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window

  return { permission, isSubscribed, isLoading, isSupported, subscribe, unsubscribe }
}
