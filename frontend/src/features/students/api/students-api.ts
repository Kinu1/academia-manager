import { httpClient } from '../../../shared/api/http-client'
import type { ApiResponse, PagedResult } from '../../../shared/api/types'
import type { CreateStudentRequest, StudentResponse, UpdateStudentRequest } from '../types'

export type ListStudentsParams = {
  page?: number
  perPage?: number
}

export async function listStudents(params: ListStudentsParams = {}) {
  const response = await httpClient.get<PagedResult<StudentResponse>>('/api/v1/students', {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
    },
  })

  return response.data
}

export async function getStudent(id: string) {
  const response = await httpClient.get<ApiResponse<StudentResponse>>(`/api/v1/students/${id}`)
  return response.data.data
}

export async function getCurrentStudent() {
  const response = await httpClient.get<ApiResponse<StudentResponse>>('/api/v1/students/me')
  return response.data.data
}

export async function chooseCurrentStudentPlan(planId: string) {
  const response = await httpClient.put<ApiResponse<StudentResponse>>('/api/v1/students/me/plan', { planId })
  return response.data.data
}

export async function createStudent(request: CreateStudentRequest) {
  const response = await httpClient.post<ApiResponse<StudentResponse>>('/api/v1/students', request)
  return response.data.data
}

export async function updateStudent(id: string, request: UpdateStudentRequest) {
  const response = await httpClient.put<ApiResponse<StudentResponse>>(`/api/v1/students/${id}`, request)
  return response.data.data
}

export async function deleteStudent(id: string) {
  await httpClient.delete(`/api/v1/students/${id}`)
}
