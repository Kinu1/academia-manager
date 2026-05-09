import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createPlan, deletePlan, getPlan, listPlans, updatePlan, type ListPlansParams } from '../api/plans-api'
import type { CreatePlanRequest, UpdatePlanRequest } from '../types'

export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (params: ListPlansParams) => [...planKeys.lists(), params] as const,
  detail: (id: string) => [...planKeys.all, 'detail', id] as const,
}

export function usePlans(params: ListPlansParams) {
  return useQuery({
    queryKey: planKeys.list(params),
    queryFn: () => listPlans(params),
  })
}

export function usePlan(id?: string) {
  return useQuery({
    queryKey: planKeys.detail(id ?? ''),
    queryFn: () => getPlan(id!),
    enabled: Boolean(id),
  })
}

export function useCreatePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePlanRequest) => createPlan(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.lists() }),
  })
}

export function useUpdatePlan(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdatePlanRequest) => updatePlan(id, request),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() })
      queryClient.setQueryData(planKeys.detail(id), plan)
    },
  })
}

export function useDeletePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.lists() }),
  })
}
