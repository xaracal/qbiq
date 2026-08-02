import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/api/errors'
import { isRetryableNetworkError, withExponentialRetry } from '@/lib/retry'

describe('retry', () => {
  it('retries retryable network errors', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new ApiError('Network error', undefined, 'NETWORK_ERROR'))
      .mockResolvedValueOnce('ok')

    await expect(withExponentialRetry(operation, 1, [0])).resolves.toBe('ok')
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('does not retry non-network errors', async () => {
    const operation = vi.fn().mockRejectedValue(new ApiError('Not found', 404, 'NOT_FOUND'))

    await expect(withExponentialRetry(operation, 2, [0])).rejects.toMatchObject({ code: 'NOT_FOUND' })
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('identifies network errors', () => {
    expect(isRetryableNetworkError(new ApiError('x', undefined, 'NETWORK_ERROR'))).toBe(true)
    expect(isRetryableNetworkError(new ApiError('x', 500, 'SERVER_ERROR'))).toBe(false)
  })
})
