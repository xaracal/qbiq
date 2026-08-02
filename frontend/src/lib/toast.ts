type ToastHandler = (summary: string, options?: { description?: string }) => void

let successHandler: ToastHandler | null = null
let errorHandler: ToastHandler | null = null

export function registerToastHandlers(handlers: {
  success: ToastHandler
  error: ToastHandler
}) {
  successHandler = handlers.success
  errorHandler = handlers.error
}

export const toast = {
  success(summary: string, options?: { description?: string }) {
    successHandler?.(summary, options)
  },

  error(summary: string, options?: { description?: string }) {
    errorHandler?.(summary, options)
  },
}
