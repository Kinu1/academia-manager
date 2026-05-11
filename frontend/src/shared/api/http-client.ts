import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

import { env } from '../config/env'
import { emitSessionExpired } from '../../features/auth/model/auth-events'
import { getStoredAuth, saveStoredAuth, clearStoredAuth } from '../../features/auth/model/auth-storage'
import type { AuthResponse } from '../../features/auth/types'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const session = getStoredAuth()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig
    const session = getStoredAuth()

    if (error.response?.status !== 401 || originalRequest?._retry || !session?.refreshToken) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const response = await axios.post<{ data: AuthResponse }>(
        `${env.apiBaseUrl}/api/v1/auth/refresh`,
        { refreshToken: session.refreshToken },
      )

      saveStoredAuth(response.data.data)
      originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`

      return httpClient(originalRequest)
    } catch (refreshError) {
      clearStoredAuth()
      emitSessionExpired()
      return Promise.reject(refreshError)
    }
  },
)
