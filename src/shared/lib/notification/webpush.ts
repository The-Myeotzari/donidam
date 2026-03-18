import webpush from 'web-push'

export type PushPayload = {
  title: string
  body: string
  deepLink?: string
  icon?: string
}

export type PushSubscriptionData = {
  endpoint: string
  p256dh: string
  auth: string
}

export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload,
) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      data: { deepLink: payload.deepLink ?? '/' },
    }),
  )
}
