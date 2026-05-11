import { describe, expect, it } from 'vitest'

import { getPaymentFiltersFromSearchParams, toPaymentSearchParams } from './payment-url-filters'

describe('payment URL filters', () => {
  it('reads valid filters', () => {
    expect(
      getPaymentFiltersFromSearchParams(
        new URLSearchParams('search=ana&status=Overdue&page=2&perPage=20&sort=amount&dir=desc'),
      ),
    ).toEqual({
      search: 'ana',
      status: 'Overdue',
      page: 2,
      perPage: 20,
      sort: 'amount',
      sortDir: 'desc',
    })
  })

  it('falls back from invalid status', () => {
    expect(getPaymentFiltersFromSearchParams(new URLSearchParams('status=Refunded')).status).toBe('All')
  })

  it('omits defaults', () => {
    expect(toPaymentSearchParams({ search: '', status: 'All', page: 1, perPage: 10 }).toString()).toBe('')
  })

  it('writes sorting params when not default', () => {
    expect(
      toPaymentSearchParams({ search: '', status: 'All', page: 1, perPage: 10, sort: 'student', sortDir: 'desc' })
        .toString(),
    ).toBe('sort=student&dir=desc')
  })
})
