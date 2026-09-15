export interface ApiResponse<T = unknown> {
  success?: boolean
  data?: T
  message?: string
  token?: string
  accessToken?: string
  user?: unknown
  [key: string]: unknown
}

export class ApiError extends Error {
  statusCode: number
  details?: unknown

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
  }
}

const TOKEN_KEY = 'siwes_auth_token'
const API_BASE_KEY = 'siwes_api_base_url'
const LIVE_MODE_KEY = 'siwes_api_live_mode'

export const getStoredToken = (): string | null => {
  try {
    const cookie = useCookie<string | null>(TOKEN_KEY)
    if (cookie.value) return cookie.value
  } catch {
    // Context fallback
  }
  if (import.meta.server) return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (token: string | null) => {
  try {
    const cookie = useCookie<string | null>(TOKEN_KEY, {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/'
    })
    cookie.value = token
  } catch {
    // Context fallback
  }

  if (import.meta.server) return
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const getCustomApiBaseUrl = (): string | null => {
  if (import.meta.server) return null
  return localStorage.getItem(API_BASE_KEY)
}

export const setCustomApiBaseUrl = (url: string | null) => {
  if (import.meta.server) return
  if (url) {
    localStorage.setItem(API_BASE_KEY, url.replace(/\/+$/, ''))
  } else {
    localStorage.removeItem(API_BASE_KEY)
  }
}

export const getLiveModeSetting = (): boolean => {
  if (import.meta.server) return false
  const val = localStorage.getItem(LIVE_MODE_KEY)
  return val === 'true'
}

export const setLiveModeSetting = (enabled: boolean) => {
  if (import.meta.server) return
  localStorage.setItem(LIVE_MODE_KEY, String(enabled))
}
