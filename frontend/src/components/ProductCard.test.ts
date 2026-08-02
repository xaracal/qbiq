import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProductCard from '@/components/ProductCard.vue'
import type { ProductSummary } from '@/types'

const product: ProductSummary = {
  id: 'ebook-python-mastery',
  name: 'Python Mastery Handbook',
  price: 29.99,
  shortDescription: 'Advanced Python patterns for production systems.',
  thumbnailUrl: 'https://example.com/python.png',
}

describe('ProductCard accessibility', () => {
  it('exposes a descriptive link label and decorative image alt text', () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: {
        stubs: {
          Card: { template: '<div><slot name="content" /></div>' },
          RouterLink: {
            props: ['to', 'ariaLabel'],
            template: '<a :href="to" :aria-label="ariaLabel"><slot /></a>',
          },
        },
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('aria-label')).toBe('View details for Python Mastery Handbook, $29.99')
    expect(wrapper.get('img').attributes('alt')).toBe('')
  })
})
