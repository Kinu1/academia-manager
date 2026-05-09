import { describe, expect, it } from 'vitest'

import { studentFormSchema } from './student-schemas'

describe('studentFormSchema', () => {
  it('accepts valid student values', () => {
    const result = studentFormSchema.safeParse({
      name: 'Pedro Silva',
      email: 'pedro@example.com',
      phone: '',
      planId: '',
      status: 'Active',
    })

    expect(result.success).toBe(true)
  })

  it('converts empty optional fields to null', () => {
    const result = studentFormSchema.parse({
      name: 'Pedro Silva',
      email: 'pedro@example.com',
      phone: '',
      planId: '',
      status: 'Active',
    })

    expect(result.phone).toBeNull()
    expect(result.planId).toBeNull()
  })

  it('rejects invalid email', () => {
    const result = studentFormSchema.safeParse({
      name: 'Pedro Silva',
      email: 'invalid',
      phone: '',
      planId: '',
      status: 'Active',
    })

    expect(result.success).toBe(false)
  })
})
