import { httpClient } from '../../../shared/api/http-client'
import type { ApiResponse, PagedResult } from '../../../shared/api/types'
import type { CreatePaymentRequest, PaymentResponse, UpdatePaymentRequest } from '../types'

export type ListPaymentsParams = {
  page?: number
  perPage?: number
}

export async function listPayments(params: ListPaymentsParams = {}) {
  const response = await httpClient.get<PagedResult<PaymentResponse>>('/api/v1/payments', {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
    },
  })

  return response.data
}

export async function getPayment(id: string) {
  const response = await httpClient.get<ApiResponse<PaymentResponse>>(`/api/v1/payments/${id}`)
  return response.data.data
}

export async function createPayment(request: CreatePaymentRequest) {
  const response = await httpClient.post<ApiResponse<PaymentResponse>>('/api/v1/payments', request)
  return response.data.data
}

export async function updatePayment(id: string, request: UpdatePaymentRequest) {
  const response = await httpClient.put<ApiResponse<PaymentResponse>>(`/api/v1/payments/${id}`, request)
  return response.data.data
}

export async function deletePayment(id: string) {
  await httpClient.delete(`/api/v1/payments/${id}`)
}
