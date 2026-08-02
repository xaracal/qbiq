export function getHealthUrl(): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

  if (apiBase.startsWith('/')) {
    return '/health'
  }

  return apiBase.replace(/\/api\/?$/, '/health')
}

export async function probeHealth(timeoutMs = 3000): Promise<boolean> {
  const response = await fetch(getHealthUrl(), {
    signal: AbortSignal.timeout(timeoutMs),
  })
  return response.ok
}
