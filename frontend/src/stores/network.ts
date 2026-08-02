import { defineStore } from 'pinia'

type ReconnectHandler = () => void

export const useNetworkStore = defineStore('network', {
  state: () => ({
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    showReconnected: false,
  }),

  actions: {
    setOffline(value: boolean) {
      this.isOffline = value
    },

    onReconnect(handler: ReconnectHandler): () => void {
      if (typeof window === 'undefined') {
        return () => undefined
      }

      window.addEventListener('app:online', handler)
      return () => window.removeEventListener('app:online', handler)
    },

    notifyReconnect() {
      this.showReconnected = true
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:online'))
      }

      window.setTimeout(() => {
        this.showReconnected = false
      }, 4000)
    },

    initListeners() {
      if (typeof window === 'undefined') {
        return
      }

      const syncOnlineStatus = () => {
        this.isOffline = !navigator.onLine
      }

      window.addEventListener('offline', () => {
        syncOnlineStatus()
      })

      window.addEventListener('online', () => {
        const wasOffline = this.isOffline
        syncOnlineStatus()
        if (wasOffline) {
          this.notifyReconnect()
        }
      })

      syncOnlineStatus()
    },
  },
})
