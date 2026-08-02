import { defineStore } from 'pinia'

import { probeHealth } from '@/lib/api-health'

export const useDemoStore = defineStore('demo', {
  state: () => ({
    isDemoMode: false,
    reason: null as string | null,
    probeComplete: false,
  }),

  actions: {
    enableDemoMode(reason = 'Backend unavailable') {
      this.isDemoMode = true
      this.reason = reason
    },

    disableDemoMode() {
      this.isDemoMode = false
      this.reason = null
    },

    markProbeComplete() {
      this.probeComplete = true
    },

    async probeLiveApi(): Promise<boolean> {
      if (import.meta.env.VITE_DEMO_FALLBACK !== 'true') {
        this.markProbeComplete()
        return true
      }

      try {
        const isHealthy = await probeHealth()
        if (isHealthy) {
          this.disableDemoMode()
          this.markProbeComplete()
          return true
        }
        throw new Error('API unhealthy')
      } catch {
        this.enableDemoMode('Backend unavailable — showing sample data')
        this.markProbeComplete()
        return false
      }
    },
  },
})
