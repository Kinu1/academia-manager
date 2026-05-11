import { describe, expect, it } from 'vitest'

import { loginSchema } from './auth-schemas'

describe('loginSchema', () => {
  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' })

    expect(result.success).toBe(false)
  })
})
