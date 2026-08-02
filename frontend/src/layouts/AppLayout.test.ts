import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import AppLayout from '@/layouts/AppLayout.vue'

vi.mock('@/stores/cart', () => ({
  useCartStore: () => ({
    fetchCart: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/stores/network', () => ({
  useNetworkStore: () => ({
    initListeners: vi.fn(),
    onReconnect: vi.fn(() => () => undefined),
  }),
}))

vi.mock('@/components/AppHeader.vue', () => ({
  default: { template: '<header data-testid="app-header" />' },
}))

vi.mock('@/components/OfflineBanner.vue', () => ({
  default: { template: '<div data-testid="offline-banner" />' },
}))

describe('AppLayout accessibility', () => {
  it('provides skip navigation and a focusable main landmark', () => {
    const wrapper = mount(AppLayout, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterView: true,
        },
      },
    })

    const skipLink = wrapper.get('a.skip-link')
    expect(skipLink.attributes('href')).toBe('#main-content')
    expect(skipLink.text()).toBe('Skip to main content')

    const main = wrapper.get('#main-content')
    expect(main.attributes('tabindex')).toBe('-1')
  })
})
