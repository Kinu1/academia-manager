import { compareNumber, compareText, type SortDirection } from '../../../shared/lib/sorting'
import type { PlanResponse } from '../types'

export type PlanStatusFilter = 'All' | 'Active' | 'Inactive'
export type PlanSortField = 'name' | 'priceAmount' | 'durationInDays' | 'status'

export type PlanFilters = {
  search: string
  status: PlanStatusFilter
  sort?: PlanSortField
  sortDir?: SortDirection
}

export function filterPlans(plans: PlanResponse[], filters: PlanFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase()

  return plans.filter((plan) => {
    const matchesSearch = normalizedSearch.length === 0 || plan.name.toLowerCase().includes(normalizedSearch)
    const matchesStatus =
      filters.status === 'All' ||
      (filters.status === 'Active' && plan.isActive) ||
      (filters.status === 'Inactive' && !plan.isActive)

    return matchesSearch && matchesStatus
  })
}

export function sortPlans(plans: PlanResponse[], filters: Pick<PlanFilters, 'sort' | 'sortDir'>) {
  const sort = filters.sort ?? 'name'
  const sortDir = filters.sortDir ?? 'asc'

  return [...plans].sort((left, right) => {
    if (sort === 'priceAmount') {
      return compareNumber(left.priceAmount, right.priceAmount, sortDir)
    }

    if (sort === 'durationInDays') {
      return compareNumber(left.durationInDays, right.durationInDays, sortDir)
    }

    if (sort === 'status') {
      return compareText(left.isActive ? 'Ativo' : 'Inativo', right.isActive ? 'Ativo' : 'Inativo', sortDir)
    }

    return compareText(left.name, right.name, sortDir)
  })
}
