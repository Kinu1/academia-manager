import { describe, expect, it } from 'vitest'

import { filterPayments } from './payment-filters'
import type { StudentResponse } from '../../students/types'
import type { PaymentResponse } from '../types'

const payments: PaymentResponse[] = [
  {
    id: 'payment-1',
    studentId: 'student-1',
    amount: 129.9,
    currency: 'BRL',
    dueDateUtc: '2026-05-15T10:00:00.000Z',
    paidAtUtc: null,
    status: 'Pending',
  },
  {
    id: 'payment-2',
    studentId: 'student-2',
    amount: 89.9,
    currency: 'BRL',
    dueDateUtc: '2026-05-10T10:00:00.000Z',
    paidAtUtc: null,
    status: 'Overdue',
  },
]

const students: StudentResponse[] = [
  {
    id: 'student-1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    status: 'Active',
  },
  {
    id: 'student-2',
    name: 'Bruno Costa',
    email: 'bruno@example.com',
    status: 'Suspended',
  },
]

describe('filterPayments', () => {
  it('filters by student name', () => {
    expect(filterPayments(payments, students, { search: 'ana', status: 'All' })).toEqual([payments[0]])
  })

  it('filters by student email', () => {
    expect(filterPayments(payments, students, { search: 'bruno@example', status: 'All' })).toEqual([payments[1]])
  })

  it('filters by payment status', () => {
    expect(filterPayments(payments, students, { search: '', status: 'Overdue' })).toEqual([payments[1]])
  })
})
