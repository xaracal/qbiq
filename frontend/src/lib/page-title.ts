const APP_NAME = 'QBIQ Dig Store'

export function setPageTitle(title?: string): void {
  document.title = title ? `${title} | ${APP_NAME}` : APP_NAME
}

export function focusMainContent(): void {
  const main = document.getElementById('main-content')
  main?.focus({ preventScroll: true })
}
