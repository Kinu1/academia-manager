import { describe, expect, it } from 'vitest'

import { planFormSchema } from './plan-schemas'

describe('planFormSchema', () => {
  it('accepts valid plan values', () => {
    const result = planFormSchema.safeParse({
      name: 'Mensal',
      priceAmount: 129.9,
      durationInDays: 30,
      isActive: true,
    })

    expect(result.success).toBe(true)
  })

  it('rejects zero price', () => {
    const result = planFormSchema.safeParse({
      name: 'Mensal',
      priceAmount: 0,
      durationInDays: 30,
      isActive: true,
    })

    expect(result.success).toBe(false)
  })

  it('rejects fractional duration', () => {
    const result = planFormSchema.safeParse({
      name: 'Mensal',
      priceAmount: 129.9,
      durationInDays: 30.5,
      isActive: true,
    })

    expect(result.success).toBe(false)
  })
})
