import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProductFilters from '@/components/ProductFilters.vue'

describe('ProductFilters accessibility', () => {
  it('renders a search form with labeled controls', () => {
    const wrapper = mount(ProductFilters, {
      global: {
        stubs: {
          InputText: {
            template:
              '<input :id="$attrs.id" :type="$attrs.type" :aria-label="$attrs[\'aria-label\']" />',
          },
          Select: {
            template: '<div :id="$attrs[\'input-id\']" />',
          },
        },
      },
    })

    const form = wrapper.get('form[role="search"]')
    expect(form.attributes('aria-label')).toBe('Filter and sort products')

    expect(wrapper.get('label[for="product-search"]').text()).toBe('Search')
    expect(wrapper.get('#product-search').attributes('aria-label')).toBe('Search products by name')
    expect(wrapper.get('label[for="product-category"]').text()).toBe('Category')
    expect(wrapper.get('label[for="product-sort"]').text()).toBe('Sort by')
  })
})
