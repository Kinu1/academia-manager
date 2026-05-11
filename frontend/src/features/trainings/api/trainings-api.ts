import { httpClient } from '../../../shared/api/http-client'
import type { ApiResponse, PagedResult } from '../../../shared/api/types'
import type { CreateTrainingRequest, TrainingResponse, UpdateTrainingRequest } from '../types'

export type ListTrainingsParams = {
  page?: number
  perPage?: number
}

export async function listTrainings(params: ListTrainingsParams = {}) {
  const response = await httpClient.get<PagedResult<TrainingResponse>>('/api/v1/trainings', {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
    },
  })

  return response.data
}

export async function getTraining(id: string) {
  const response = await httpClient.get<ApiResponse<TrainingResponse>>(`/api/v1/trainings/${id}`)
  return response.data.data
}

export async function createTraining(request: CreateTrainingRequest) {
  const response = await httpClient.post<ApiResponse<TrainingResponse>>('/api/v1/trainings', request)
  return response.data.data
}

export async function updateTraining(id: string, request: UpdateTrainingRequest) {
  const response = await httpClient.put<ApiResponse<TrainingResponse>>(`/api/v1/trainings/${id}`, request)
  return response.data.data
}

export async function deleteTraining(id: string) {
  await httpClient.delete(`/api/v1/trainings/${id}`)
}
