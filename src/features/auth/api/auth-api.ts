import { httpClient } from '../../../shared/api/http-client'
import type { ApiResponse } from '../../../shared/api/types'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export async function login(request: LoginRequest) {
  const response = await httpClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', request)
  return response.data.data
}

export async function register(request: RegisterRequest) {
  const response = await httpClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', request)
  return response.data.data
}
