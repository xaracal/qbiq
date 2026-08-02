import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { ApiError } from '@/api/errors'
import { getCartSessionId } from '@/api/session'
import { useNetworkStore } from '@/stores/network'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function markOnline() {
  useNetworkStore().setOffline(false)
}

function markOffline() {
  useNetworkStore().setOffline(true)
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('X-Cart-Session-Id', getCartSessionId())
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    markOnline()
    return response
  },
  (error: AxiosError<{ detail?: string }>) => {
    if (error.code === 'ECONNABORTED') {
      markOffline()
      return Promise.reject(
        new ApiError('Request timed out. Please try again.', undefined, 'NETWORK_ERROR'),
      )
    }

    if (!error.response) {
      markOffline()
      return Promise.reject(
        new ApiError('Network error. Check your connection and try again.', undefined, 'NETWORK_ERROR'),
      )
    }

    const status = error.response.status
    const detail = error.response.data?.detail ?? error.message

    if (status === 404) {
      return Promise.reject(new ApiError(detail, status, 'NOT_FOUND'))
    }
    if (status === 400) {
      return Promise.reject(new ApiError(detail, status, 'BAD_REQUEST'))
    }
    if (status === 503) {
      return Promise.reject(new ApiError(detail, status, 'SERVICE_UNAVAILABLE'))
    }
    if (status >= 500) {
      return Promise.reject(new ApiError(detail, status, 'SERVER_ERROR'))
    }

    return Promise.reject(new ApiError(detail, status, 'SERVER_ERROR'))
  },
)

export async function withGetRetry<T>(request: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await request()
  } catch (error) {
    if (retries > 0 && error instanceof ApiError && error.code === 'NETWORK_ERROR') {
      await new Promise((resolve) => setTimeout(resolve, 500 * (2 - retries)))
      return withGetRetry(request, retries - 1)
    }
    throw error
  }
}
