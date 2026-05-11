import { describe, expect, it } from 'vitest'

import { getPlanFiltersFromSearchParams, toPlanSearchParams } from './plan-url-filters'

describe('plan URL filters', () => {
  it('reads valid filters', () => {
    expect(
      getPlanFiltersFromSearchParams(
        new URLSearchParams('search=mensal&status=Active&page=2&perPage=20&sort=priceAmount&dir=desc'),
      ),
    ).toEqual({
      search: 'mensal',
      status: 'Active',
      page: 2,
      perPage: 20,
      sort: 'priceAmount',
      sortDir: 'desc',
    })
  })

  it('falls back from invalid status', () => {
    expect(getPlanFiltersFromSearchParams(new URLSearchParams('status=Deleted')).status).toBe('All')
  })

  it('omits defaults', () => {
    expect(toPlanSearchParams({ search: '', status: 'All', page: 1, perPage: 10 }).toString()).toBe('')
  })

  it('writes sorting params when not default', () => {
    expect(
      toPlanSearchParams({ search: '', status: 'All', page: 1, perPage: 10, sort: 'durationInDays', sortDir: 'desc' })
        .toString(),
    ).toBe('sort=durationInDays&dir=desc')
  })
})
