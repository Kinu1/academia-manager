import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { clearStoredAuth, getStoredAuth, saveStoredAuth } from './auth-storage'
import type { AuthResponse, AuthUser } from '../types'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  expiresAtUtc: string | null
}

const storedAuth = typeof window === 'undefined' ? null : getStoredAuth()

const initialState: AuthState = {
  user: storedAuth?.user ?? null,
  accessToken: storedAuth?.accessToken ?? null,
  refreshToken: storedAuth?.refreshToken ?? null,
  expiresAtUtc: storedAuth?.expiresAtUtc ?? null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionReceived(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.expiresAtUtc = action.payload.expiresAtUtc
      saveStoredAuth(action.payload)
    },
    loggedOut(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.expiresAtUtc = null
      clearStoredAuth()
    },
  },
})

export const { sessionReceived, loggedOut } = authSlice.actions
export const authReducer = authSlice.reducer
