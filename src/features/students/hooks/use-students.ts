import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createStudent,
  deleteStudent,
  getStudent,
  listStudents,
  updateStudent,
  type ListStudentsParams,
} from '../api/students-api'
import type { CreateStudentRequest, UpdateStudentRequest } from '../types'

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: ListStudentsParams) => [...studentKeys.lists(), params] as const,
  detail: (id: string) => [...studentKeys.all, 'detail', id] as const,
}

export function useStudents(params: ListStudentsParams) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => listStudents(params),
  })
}

export function useStudent(id?: string) {
  return useQuery({
    queryKey: studentKeys.detail(id ?? ''),
    queryFn: () => getStudent(id!),
    enabled: Boolean(id),
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateStudentRequest) => createStudent(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentKeys.lists() }),
  })
}

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateStudentRequest) => updateStudent(id, request),
    onSuccess: (student) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      queryClient.setQueryData(studentKeys.detail(id), student)
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentKeys.lists() }),
  })
}
