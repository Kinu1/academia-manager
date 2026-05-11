import type { SortDirection } from '../../../shared/lib/sorting'
import type { TrainingSortField } from './training-filters'

const validSorts: TrainingSortField[] = ['title', 'student', 'scheduledForUtc']
const validSortDirections: SortDirection[] = ['asc', 'desc']

export function getTrainingFiltersFromSearchParams(params: URLSearchParams) {
  const scheduledDate = params.get('date') ?? ''
  const sort = params.get('sort')
  const sortDir = params.get('dir')

  return {
    search: params.get('search') ?? '',
    scheduledDate: isDateInputValue(scheduledDate) ? scheduledDate : '',
    page: getPositiveInteger(params.get('page'), 1),
    perPage: getAllowedPerPage(params.get('perPage')),
    sort: isTrainingSortField(sort) ? sort : 'scheduledForUtc',
    sortDir: isSortDirection(sortDir) ? sortDir : 'asc',
  }
}

export function toTrainingSearchParams(filters: {
  search: string
  scheduledDate: string
  page: number
  perPage: number
  sort?: TrainingSortField
  sortDir?: SortDirection
}) {
  const params = new URLSearchParams()
  const search = filters.search.trim()
  const sort = filters.sort ?? 'scheduledForUtc'
  const sortDir = filters.sortDir ?? 'asc'

  if (search) {
    params.set('search', search)
  }

  if (isDateInputValue(filters.scheduledDate)) {
    params.set('date', filters.scheduledDate)
  }

  if (filters.page > 1) {
    params.set('page', String(filters.page))
  }

  if (filters.perPage !== 10) {
    params.set('perPage', String(filters.perPage))
  }

  if (sort !== 'scheduledForUtc') {
    params.set('sort', sort)
  }

  if (sortDir !== 'asc') {
    params.set('dir', sortDir)
  }

  return params
}

function isDateInputValue(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isTrainingSortField(value: string | null): value is TrainingSortField {
  return validSorts.includes(value as TrainingSortField)
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
