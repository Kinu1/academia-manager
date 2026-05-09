import { httpClient } from '../../../shared/api/http-client'
import type { ApiResponse, PagedResult } from '../../../shared/api/types'
import type { CreatePlanRequest, PlanResponse, UpdatePlanRequest } from '../types'

export type ListPlansParams = {
  page?: number
  perPage?: number
}

export async function listPlans(params: ListPlansParams = {}) {
  const response = await httpClient.get<PagedResult<PlanResponse>>('/api/v1/plans', {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
    },
  })

  return response.data
}

export async function getPlan(id: string) {
  const response = await httpClient.get<ApiResponse<PlanResponse>>(`/api/v1/plans/${id}`)
  return response.data.data
}

export async function createPlan(request: CreatePlanRequest) {
  const response = await httpClient.post<ApiResponse<PlanResponse>>('/api/v1/plans', request)
  return response.data.data
}

export async function updatePlan(id: string, request: UpdatePlanRequest) {
  const response = await httpClient.put<ApiResponse<PlanResponse>>(`/api/v1/plans/${id}`, request)
  return response.data.data
}

export async function deletePlan(id: string) {
  await httpClient.delete(`/api/v1/plans/${id}`)
}
