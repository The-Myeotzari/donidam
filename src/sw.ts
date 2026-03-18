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
