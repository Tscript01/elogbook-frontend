import { ref } from 'vue'
import {
  ApiError,
  getCustomApiBaseUrl,
  getLiveModeSetting,
  getStoredToken,
  setCustomApiBaseUrl,
  setLiveModeSetting,
  setStoredToken
} from '~/utils/storage'

interface FetchErrorStructure {
  name?: string
  message?: string
  statusCode?: number
  response?: { status?: number }
  data?: unknown
  cause?: { code?: string }
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const defaultBase = (config.public.apiBase as string) || 'http://localhost:5000/api'

  const customBase = ref<string | null>(getCustomApiBaseUrl())
  const liveMode = ref<boolean>(getLiveModeSetting())
  const token = ref<string | null>(getStoredToken())

  const apiBaseUrl = computed(() => {
    return customBase.value || defaultBase
  })

  const updateApiBaseUrl = (newUrl: string) => {
    const formatted = newUrl.trim().replace(/\/+$/, '')
    setCustomApiBaseUrl(formatted)
    customBase.value = formatted
  }

  const resetApiBaseUrl = () => {
    setCustomApiBaseUrl(null)
    customBase.value = null
  }

  const setLiveMode = (enabled: boolean) => {
    liveMode.value = enabled
    setLiveModeSetting(enabled)
  }

  const setAuthToken = (newToken: string | null) => {
    token.value = newToken
    setStoredToken(newToken)
  }

  const request = async <T = unknown>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      body?: unknown
      query?: Record<string, unknown>
      headers?: Record<string, string>
    } = {}
  ): Promise<T> => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${apiBaseUrl.value}${cleanEndpoint}`

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
    if (!isFormData && options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    try {
      const response = await $fetch<T>(url, {
        method: options.method || 'GET',
        headers,
        body: options.body as RequestInit['body'],
        query: options.query
      })

      return response
    } catch (rawError: unknown) {
      const error = (rawError || {}) as FetchErrorStructure
      const statusCode = error.response?.status || error.statusCode || 500
      let message = 'An unexpected server error occurred'

      if (error.data) {
        if (typeof error.data === 'string') {
          message = error.data
        } else if (
          typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          typeof (error.data as { message: unknown }).message === 'string'
        ) {
          message = (error.data as { message: string }).message
        } else if (
          typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          typeof (error.data as { error: unknown }).error === 'string'
        ) {
          message = (error.data as { error: string }).error
        }
      } else if (error.message) {
        message = error.message
      }

      if (
        error.name === 'FetchError' &&
        (message.includes('fetch failed') ||
          message.includes('Failed to fetch') ||
          error.cause?.code === 'ECONNREFUSED')
      ) {
        message = `Unable to connect to backend at ${apiBaseUrl.value}. Please verify your server is running and CORS is enabled.`
      }

      throw new ApiError(message, statusCode, error.data)
    }
  }

  const testConnection = async (
    testUrl?: string
  ): Promise<{ success: boolean; message: string; latencyMs: number }> => {
    const start = performance.now()
    const targetUrl = (testUrl || apiBaseUrl.value).replace(/\/+$/, '')

    try {
      await $fetch(`${targetUrl}/health`, {
        method: 'GET',
        timeout: 4000
      }).catch(async () => {
        return await $fetch(targetUrl, {
          method: 'GET',
          timeout: 4000
        })
      })

      const latencyMs = Math.round(performance.now() - start)
      return {
        success: true,
        message: `Connected successfully (${latencyMs}ms)`,
        latencyMs
      }
    } catch (rawErr: unknown) {
      const latencyMs = Math.round(performance.now() - start)
      const err = (rawErr || {}) as FetchErrorStructure
      const errorMsg = err.response?.status
        ? `Server responded with status ${err.response.status}`
        : err.message || 'Connection refused or timed out'
      return {
        success: false,
        message: errorMsg,
        latencyMs
      }
    }
  }

  return {
    apiBaseUrl,
    liveMode,
    token,
    updateApiBaseUrl,
    resetApiBaseUrl,
    setLiveMode,
    setAuthToken,
    request,
    testConnection
  }
}
