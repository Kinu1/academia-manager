import { describe, expect, it } from 'vitest'

import { getTrainingFiltersFromSearchParams, toTrainingSearchParams } from './training-url-filters'

describe('training URL filters', () => {
  it('reads filters', () => {
    expect(
      getTrainingFiltersFromSearchParams(
        new URLSearchParams('search=pernas&date=2026-05-15&page=3&perPage=50&sort=student&dir=desc'),
      ),
    ).toEqual({
      search: 'pernas',
      scheduledDate: '2026-05-15',
      page: 3,
      perPage: 50,
      sort: 'student',
      sortDir: 'desc',
    })
  })

  it('falls back from invalid date', () => {
    expect(getTrainingFiltersFromSearchParams(new URLSearchParams('date=15/05/2026')).scheduledDate).toBe('')
  })

  it('omits defaults', () => {
    expect(toTrainingSearchParams({ search: '', scheduledDate: '', page: 1, perPage: 10 }).toString()).toBe('')
  })

  it('writes sorting params when not default', () => {
    expect(
      toTrainingSearchParams({ search: '', scheduledDate: '', page: 1, perPage: 10, sort: 'title', sortDir: 'desc' })
        .toString(),
    ).toBe('sort=title&dir=desc')
  })
})
