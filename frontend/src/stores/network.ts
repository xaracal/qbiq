import { defineStore } from 'pinia'

export const useNetworkStore = defineStore('network', {
  state: () => ({
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  }),

  actions: {
    setOffline(value: boolean) {
      this.isOffline = value
    },

    initListeners() {
      if (typeof window === 'undefined') {
        return
      }

      const syncOnlineStatus = () => {
        this.isOffline = !navigator.onLine
      }

      window.addEventListener('online', syncOnlineStatus)
      window.addEventListener('offline', syncOnlineStatus)
      syncOnlineStatus()
    },
  },
})
