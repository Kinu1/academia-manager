import { describe, expect, it } from 'vitest'

import { ApiError, getApiFieldErrors } from './api-error'

describe('getApiFieldErrors', () => {
  it('maps validation details to form field names', () => {
    const error = new ApiError('Revise os campos informados.', 'validation_error', 400, [
      { field: 'Email', message: 'E-mail ja cadastrado.', code: 'duplicate' },
      { field: 'request.PriceAmount', message: 'Valor invalido.', code: 'invalid' },
    ])

    expect(getApiFieldErrors(error, ['email', 'priceAmount'])).toEqual({
      email: 'E-mail ja cadastrado.',
      priceAmount: 'Valor invalido.',
    })
  })

  it('ignores details for unknown fields', () => {
    const error = new ApiError('Revise os campos informados.', 'validation_error', 400, [
      { field: 'unknown', message: 'Erro desconhecido.', code: 'invalid' },
    ])

    expect(getApiFieldErrors(error, ['email'])).toEqual({})
  })
})
