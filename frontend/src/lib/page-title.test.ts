import { describe, expect, it } from 'vitest'

import { focusMainContent, setPageTitle } from '@/lib/page-title'

describe('page-title', () => {
  it('sets document title with app name suffix', () => {
    setPageTitle('Products')
    expect(document.title).toBe('Products | QBIQ Dig Store')
  })

  it('resets document title to app name only', () => {
    setPageTitle()
    expect(document.title).toBe('QBIQ Dig Store')
  })

  it('focuses the main content landmark', () => {
    document.body.innerHTML = '<main id="main-content" tabindex="-1"></main>'
    const main = document.getElementById('main-content') as HTMLElement

    focusMainContent()

    expect(document.activeElement).toBe(main)
  })
})
