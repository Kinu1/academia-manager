import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTraining,
  deleteTraining,
  getTraining,
  listTrainings,
  updateTraining,
  type ListTrainingsParams,
} from '../api/trainings-api'
import type { CreateTrainingRequest, UpdateTrainingRequest } from '../types'

export const trainingKeys = {
  all: ['trainings'] as const,
  lists: () => [...trainingKeys.all, 'list'] as const,
  list: (params: ListTrainingsParams) => [...trainingKeys.lists(), params] as const,
  detail: (id: string) => [...trainingKeys.all, 'detail', id] as const,
}

export function useTrainings(params: ListTrainingsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: trainingKeys.list(params),
    queryFn: () => listTrainings(params),
    enabled: options?.enabled ?? true,
  })
}

export function useTraining(id?: string) {
  return useQuery({
    queryKey: trainingKeys.detail(id ?? ''),
    queryFn: () => getTraining(id!),
    enabled: Boolean(id),
  })
}

export function useCreateTraining() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateTrainingRequest) => createTraining(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.lists() }),
  })
}

export function useUpdateTraining(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateTrainingRequest) => updateTraining(id, request),
    onSuccess: (training) => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() })
      queryClient.setQueryData(trainingKeys.detail(id), training)
    },
  })
}

export function useDeleteTraining() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTraining(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.lists() }),
  })
}
