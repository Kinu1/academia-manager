import type { StudentStatusFilter } from './student-filters'
import type { SortDirection } from '../../../shared/lib/sorting'
import type { StudentSortField } from './student-filters'

const validStatuses: StudentStatusFilter[] = ['All', 'Active', 'Inactive', 'Suspended']
const validSorts: StudentSortField[] = ['name', 'email', 'status']
const validSortDirections: SortDirection[] = ['asc', 'desc']

export function getStudentFiltersFromSearchParams(params: URLSearchParams) {
  const status = params.get('status')
  const sort = params.get('sort')
  const sortDir = params.get('dir')

  return {
    search: params.get('search') ?? '',
    status: isStudentStatusFilter(status) ? status : 'All',
    page: getPositiveInteger(params.get('page'), 1),
    perPage: getAllowedPerPage(params.get('perPage')),
    sort: isStudentSortField(sort) ? sort : 'name',
    sortDir: isSortDirection(sortDir) ? sortDir : 'asc',
  }
}

export function toStudentSearchParams(filters: {
  search: string
  status: StudentStatusFilter
  page: number
  perPage: number
  sort?: StudentSortField
  sortDir?: SortDirection
}) {
  const params = new URLSearchParams()
  const search = filters.search.trim()
  const sort = filters.sort ?? 'name'
  const sortDir = filters.sortDir ?? 'asc'

  if (search) {
    params.set('search', search)
  }

  if (filters.status !== 'All') {
    params.set('status', filters.status)
  }

  if (filters.page > 1) {
    params.set('page', String(filters.page))
  }

  if (filters.perPage !== 10) {
    params.set('perPage', String(filters.perPage))
  }

  if (sort !== 'name') {
    params.set('sort', sort)
  }

  if (sortDir !== 'asc') {
    params.set('dir', sortDir)
  }

  return params
}

function isStudentStatusFilter(value: string | null): value is StudentStatusFilter {
  return validStatuses.includes(value as StudentStatusFilter)
}

function isStudentSortField(value: string | null): value is StudentSortField {
  return validSorts.includes(value as StudentSortField)
}

function isSortDirection(value: string | null): value is SortDirection {
  return validSortDirections.includes(value as SortDirection)
}

function getPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function getAllowedPerPage(value: string | null) {
  const parsed = Number(value)

  return [10, 20, 50].includes(parsed) ? parsed : 10
}
