import { describe, expect, it } from 'vitest'

import { paymentFormSchema } from './payment-schemas'

describe('paymentFormSchema', () => {
  it('accepts valid payment values', () => {
    const result = paymentFormSchema.safeParse({
      studentId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 129.9,
      dueDateUtc: '2026-05-15T10:00',
      status: 'Pending',
    })

    expect(result.success).toBe(true)
  })

  it('rejects zero amount', () => {
    const result = paymentFormSchema.safeParse({
      studentId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 0,
      dueDateUtc: '2026-05-15T10:00',
      status: 'Pending',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = paymentFormSchema.safeParse({
      studentId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 129.9,
      dueDateUtc: '2026-05-15T10:00',
      status: 'Refunded',
    })

    expect(result.success).toBe(false)
  })
})
