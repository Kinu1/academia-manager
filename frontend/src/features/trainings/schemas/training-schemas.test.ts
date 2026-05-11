import { describe, expect, it } from 'vitest'

import { trainingFormSchema } from './training-schemas'

describe('trainingFormSchema', () => {
  it('accepts valid training values', () => {
    const result = trainingFormSchema.safeParse({
      studentId: '0f7f7e87-01df-4d4a-8abc-9ddcf8cf5170',
      title: 'Treino A',
      description: 'Peito e triceps',
      scheduledForUtc: '2026-05-08T18:30',
    })

    expect(result.success).toBe(true)
  })

  it('requires a valid student id', () => {
    const result = trainingFormSchema.safeParse({
      studentId: '',
      title: 'Treino A',
      description: 'Peito e triceps',
      scheduledForUtc: '2026-05-08T18:30',
    })

    expect(result.success).toBe(false)
  })

  it('requires scheduled date and time', () => {
    const result = trainingFormSchema.safeParse({
      studentId: '0f7f7e87-01df-4d4a-8abc-9ddcf8cf5170',
      title: 'Treino A',
      description: 'Peito e triceps',
      scheduledForUtc: '',
    })

    expect(result.success).toBe(false)
  })
})
