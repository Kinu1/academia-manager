import type { AuthResponse } from '../types'

const STORAGE_KEY = 'academia-manager.session'

export function getStoredAuth(): AuthResponse | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthResponse
  } catch {
    clearStoredAuth()
    return null
  }
}

export function saveStoredAuth(session: AuthResponse) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredAuth() {
  window.localStorage.removeItem(STORAGE_KEY)
}
