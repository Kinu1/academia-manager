import { describe, expect, it } from 'vitest'

import { filterStudents } from './student-filters'
import type { StudentResponse } from '../types'

const students: StudentResponse[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    phone: '11999990000',
    status: 'Active',
    planId: 'plan-1',
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno@example.com',
    phone: null,
    status: 'Suspended',
    planId: null,
  },
]

describe('filterStudents', () => {
  it('filters by name', () => {
    expect(filterStudents(students, { search: 'ana', status: 'All' })).toEqual([students[0]])
  })

  it('filters by email', () => {
    expect(filterStudents(students, { search: 'bruno@example', status: 'All' })).toEqual([students[1]])
  })

  it('filters by status', () => {
    expect(filterStudents(students, { search: '', status: 'Suspended' })).toEqual([students[1]])
  })
})
