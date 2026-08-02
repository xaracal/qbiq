const SESSION_KEY = 'qbiq-dig-store-cart-session-id'

export function getCartSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) {
    return existing
  }

  const sessionId = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, sessionId)
  return sessionId
}
