import { describe, expect, it } from 'vitest'

import { getStudentFiltersFromSearchParams, toStudentSearchParams } from './student-url-filters'

describe('student URL filters', () => {
  it('reads valid filters from search params', () => {
    const params = new URLSearchParams('search=ana&status=Active&page=2&perPage=20&sort=email&dir=desc')

    expect(getStudentFiltersFromSearchParams(params)).toEqual({
      search: 'ana',
      status: 'Active',
      page: 2,
      perPage: 20,
      sort: 'email',
      sortDir: 'desc',
    })
  })

  it('falls back from invalid status', () => {
    const params = new URLSearchParams('search=ana&status=Deleted')

    expect(getStudentFiltersFromSearchParams(params)).toEqual({
      search: 'ana',
      status: 'All',
      page: 1,
      perPage: 10,
      sort: 'name',
      sortDir: 'asc',
    })
  })

  it('omits empty default values when writing params', () => {
    expect(toStudentSearchParams({ search: '', status: 'All', page: 1, perPage: 10 }).toString()).toBe('')
  })

  it('writes sorting params when not default', () => {
    expect(
      toStudentSearchParams({ search: '', status: 'All', page: 1, perPage: 10, sort: 'status', sortDir: 'desc' })
        .toString(),
    ).toBe('sort=status&dir=desc')
  })
})
