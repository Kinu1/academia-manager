import type { PlanResponse } from '../types'

export type PlanStatusFilter = 'All' | 'Active' | 'Inactive'

export type PlanFilters = {
  search: string
  status: PlanStatusFilter
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
