import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createPayment,
  deletePayment,
  getPayment,
  listCurrentStudentPayments,
  listPayments,
  updatePayment,
  type ListPaymentsParams,
} from '../api/payments-api'
import type { CreatePaymentRequest, UpdatePaymentRequest } from '../types'

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params: ListPaymentsParams) => [...paymentKeys.lists(), params] as const,
  mine: (params: ListPaymentsParams) => [...paymentKeys.all, 'mine', params] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const,
}

export function usePayments(params: ListPaymentsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => listPayments(params),
    enabled: options?.enabled ?? true,
  })
}

export function useCurrentStudentPayments(params: ListPaymentsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: paymentKeys.mine(params),
    queryFn: () => listCurrentStudentPayments(params),
    enabled: options?.enabled ?? true,
  })
}

export function usePayment(id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: paymentKeys.detail(id ?? ''),
    queryFn: () => getPayment(id!),
    enabled: Boolean(id) && (options?.enabled ?? true),
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => createPayment(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: paymentKeys.lists() }),
  })
}

export function useUpdatePayment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdatePaymentRequest) => updatePayment(id, request),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      queryClient.setQueryData(paymentKeys.detail(id), payment)
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: paymentKeys.lists() }),
  })
}
