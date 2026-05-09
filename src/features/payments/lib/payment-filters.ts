import type { StudentResponse } from '../../students/types'
import type { PaymentResponse, PaymentStatus } from '../types'

export type PaymentStatusFilter = PaymentStatus | 'All'

export type PaymentFilters = {
  search: string
  status: PaymentStatusFilter
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
