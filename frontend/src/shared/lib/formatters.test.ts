import { describe, expect, it } from 'vitest'

import { toDateTimeInputValue, toLocalDateTimeValue, toPtBrDateInputValue, toTimeInputValue, toUtcIsoString } from './formatters'

describe('date formatters', () => {
  it('formats ISO date for datetime-local input', () => {
    expect(toDateTimeInputValue('2026-05-08T18:30:00.000Z')).toMatch(/2026-05-08T/)
  })

  it('formats local input parts for pt-BR date and 24-hour time', () => {
    expect(toPtBrDateInputValue('2026-05-08T18:30:00.000Z')).toBe('08/05/2026')
    expect(toTimeInputValue('2026-05-08T18:30:00.000Z')).toBe('15:30')
  })

  it('builds a local datetime value from Brazilian date and 24-hour time', () => {
    expect(toLocalDateTimeValue('08/05/2026', '18:30')).toBe('2026-05-08T18:30')
  })

  it('returns empty string for invalid Brazilian date parts', () => {
    expect(toLocalDateTimeValue('31/02/2026', '18:30')).toBe('')
    expect(toLocalDateTimeValue('08/05/2026', '25:30')).toBe('')
  })

  it('converts datetime-local value to ISO string', () => {
    expect(toUtcIsoString('2026-05-08T18:30')).toContain('T')
  })
})
