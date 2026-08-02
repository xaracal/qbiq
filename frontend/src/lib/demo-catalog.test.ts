import { describe, expect, it } from 'vitest'

import { listDemoProducts, getDemoProduct } from '@/lib/demo-catalog'

describe('demo-catalog', () => {
  it('filters products by name case-insensitively', () => {
    const results = listDemoProducts({ name: 'python' })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((product) => product.name.toLowerCase().includes('python'))).toBe(true)
  })

  it('filters products by category', () => {
    const results = listDemoProducts({ category: 'course' })
    expect(results.length).toBeGreaterThan(0)
  })

  it('sorts products by price descending', () => {
    const results = listDemoProducts({ sort_by: 'price', sort_order: 'desc' })
    const prices = results.map((product) => product.price)
    expect(prices).toEqual([...prices].sort((left, right) => right - left))
  })

  it('returns product detail by id', () => {
    const product = getDemoProduct('ebook-python-mastery')
    expect(product?.name).toBe('Python Mastery Handbook')
    expect(product?.reviews.length).toBe(2)
  })
})
