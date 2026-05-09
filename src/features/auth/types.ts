import type { UserRole } from '../../shared/api/types'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresAtUtc: string
  user: AuthUser
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = LoginRequest & {
  name: string
  role: UserRole
}
