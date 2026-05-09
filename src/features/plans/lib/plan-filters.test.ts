import { describe, expect, it } from 'vitest'

import { filterPlans } from './plan-filters'
import type { PlanResponse } from '../types'

const plans: PlanResponse[] = [
  {
    id: 'plan-1',
    name: 'Mensal',
    priceAmount: 129.9,
    priceCurrency: 'BRL',
    durationInDays: 30,
    isActive: true,
  },
  {
    id: 'plan-2',
    name: 'Trimestral',
    priceAmount: 329.9,
    priceCurrency: 'BRL',
    durationInDays: 90,
    isActive: false,
  },
]

describe('filterPlans', () => {
  it('filters by name', () => {
    expect(filterPlans(plans, { search: 'mensal', status: 'All' })).toEqual([plans[0]])
  })

  it('filters active plans', () => {
    expect(filterPlans(plans, { search: '', status: 'Active' })).toEqual([plans[0]])
  })

  it('filters inactive plans', () => {
    expect(filterPlans(plans, { search: '', status: 'Inactive' })).toEqual([plans[1]])
  })
})
