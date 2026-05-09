import { describe, expect, it } from 'vitest'

import { toDateTimeInputValue, toUtcIsoString } from './formatters'

describe('date formatters', () => {
  it('formats ISO date for datetime-local input', () => {
    expect(toDateTimeInputValue('2026-05-08T18:30:00.000Z')).toMatch(/2026-05-08T/)
  })

  it('converts datetime-local value to ISO string', () => {
    expect(toUtcIsoString('2026-05-08T18:30')).toContain('T')
  })
})
