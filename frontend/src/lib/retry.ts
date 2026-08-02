const DEFAULT_DELAYS_MS = [500, 1500]

export function isRetryableNetworkError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'NETWORK_ERROR'
  )
}

export async function withExponentialRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
  delaysMs: number[] = DEFAULT_DELAYS_MS,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries <= 0 || !isRetryableNetworkError(error)) {
      throw error
    }

    const delay = delaysMs[delaysMs.length - retries] ?? delaysMs.at(-1) ?? 1000
    await new Promise((resolve) => setTimeout(resolve, delay))
    return withExponentialRetry(operation, retries - 1, delaysMs)
  }
}
