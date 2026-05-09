import type { AxiosError } from 'axios'

import type { ApiErrorResponse } from './types'

const errorMessages: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha invalidos.',
  email_conflict: 'Este e-mail ja esta cadastrado.',
  data_conflict: 'Estes dados ja existem ou entram em conflito.',
  validation_error: 'Revise os campos informados.',
}

export class ApiError extends Error {
  readonly code: string
  readonly status?: number
  readonly details: ApiErrorResponse['error']['details']

  constructor(
    message: string,
    code: string,
    status?: number,
    details: ApiErrorResponse['error']['details'] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const payload = axiosError.response?.data

  if (payload?.error) {
    return new ApiError(
      errorMessages[payload.error.code] ?? payload.error.message,
      payload.error.code,
      axiosError.response?.status,
      payload.error.details ?? [],
    )
  }

  return new ApiError('Nao foi possivel concluir a operacao.', 'unknown_error')
}

export function getApiFieldErrors(error: ApiError | null, fields: string[]) {
  if (!error?.details?.length) {
    return {}
  }

  const fieldsByNormalizedName = new Map(fields.map((field) => [normalizeFieldName(field), field]))
  const fieldErrors: Record<string, string> = {}

  for (const detail of error.details) {
    const normalizedField = normalizeFieldName(detail.field)
    const formField = fieldsByNormalizedName.get(normalizedField)

    if (formField && !fieldErrors[formField]) {
      fieldErrors[formField] = detail.message
    }
  }

  return fieldErrors
}

function normalizeFieldName(field: string) {
  const segments = field.split(/[.[\]]/).filter(Boolean)
  const lastSegment = segments.at(-1) ?? field

  return `${lastSegment.charAt(0).toLowerCase()}${lastSegment.slice(1)}`.toLowerCase()
}
