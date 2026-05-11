import type { SortDirection } from '../../../shared/lib/sorting'
import type { PaymentSortField } from './payment-filters'
import type { PaymentStatusFilter } from './payment-filters'

const validStatuses: PaymentStatusFilter[] = ['All', 'Pending', 'Paid', 'Overdue', 'Canceled']
const validSorts: PaymentSortField[] = ['student', 'amount', 'dueDateUtc', 'status']
const validSortDirections: SortDirection[] = ['asc', 'desc']

export function getPaymentFiltersFromSearchParams(params: URLSearchParams) {
  const status = params.get('status')
  const sort = params.get('sort')
  const sortDir = params.get('dir')

  return {
    search: params.get('search') ?? '',
    status: isPaymentStatusFilter(status) ? status : 'All',
    page: getPositiveInteger(params.get('page'), 1),
    perPage: getAllowedPerPage(params.get('perPage')),
    sort: isPaymentSortField(sort) ? sort : 'dueDateUtc',
    sortDir: isSortDirection(sortDir) ? sortDir : 'asc',
  }
}

export function toPaymentSearchParams(filters: {
  search: string
  status: PaymentStatusFilter
  page: number
  perPage: number
  sort?: PaymentSortField
  sortDir?: SortDirection
}) {
  const params = new URLSearchParams()
  const search = filters.search.trim()
  const sort = filters.sort ?? 'dueDateUtc'
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

  if (sort !== 'dueDateUtc') {
    params.set('sort', sort)
  }

  if (sortDir !== 'asc') {
    params.set('dir', sortDir)
  }

  return params
}

function isPaymentStatusFilter(value: string | null): value is PaymentStatusFilter {
  return validStatuses.includes(value as PaymentStatusFilter)
}

function isPaymentSortField(value: string | null): value is PaymentSortField {
  return validSorts.includes(value as PaymentSortField)
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
