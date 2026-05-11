import { compareDate, compareNumber, compareText, type SortDirection } from '../../../shared/lib/sorting'
import type { StudentResponse } from '../../students/types'
import type { PaymentResponse, PaymentStatus } from '../types'

export type PaymentStatusFilter = PaymentStatus | 'All'
export type PaymentSortField = 'student' | 'amount' | 'dueDateUtc' | 'status'

export type PaymentFilters = {
  search: string
  status: PaymentStatusFilter
  sort?: PaymentSortField
  sortDir?: SortDirection
}

export function filterPayments(payments: PaymentResponse[], students: StudentResponse[], filters: PaymentFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase()
  const studentsById = new Map(students.map((student) => [student.id, student]))

  return payments.filter((payment) => {
    const student = studentsById.get(payment.studentId)
    const matchesSearch =
      normalizedSearch.length === 0 ||
      student?.name.toLowerCase().includes(normalizedSearch) ||
      student?.email.toLowerCase().includes(normalizedSearch)
    const matchesStatus = filters.status === 'All' || payment.status === filters.status

    return matchesSearch && matchesStatus
  })
}

export function sortPayments(
  payments: PaymentResponse[],
  students: StudentResponse[],
  filters: Pick<PaymentFilters, 'sort' | 'sortDir'>,
) {
  const sort = filters.sort ?? 'dueDateUtc'
  const sortDir = filters.sortDir ?? 'asc'
  const studentNames = new Map(students.map((student) => [student.id, student.name]))

  return [...payments].sort((left, right) => {
    if (sort === 'student') {
      return compareText(studentNames.get(left.studentId) ?? '', studentNames.get(right.studentId) ?? '', sortDir)
    }

    if (sort === 'amount') {
      return compareNumber(left.amount, right.amount, sortDir)
    }

    if (sort === 'status') {
      return compareText(left.status, right.status, sortDir)
    }

    return compareDate(left.dueDateUtc, right.dueDateUtc, sortDir)
  })
}
