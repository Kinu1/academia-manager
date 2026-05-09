import type { StudentStatus } from '../../../shared/api/types'
import type { StudentResponse } from '../types'

export type StudentStatusFilter = StudentStatus | 'All'

export type StudentFilters = {
  search: string
  status: StudentStatusFilter
}

export function filterStudents(students: StudentResponse[], filters: StudentFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase()

  return students.filter((student) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      student.name.toLowerCase().includes(normalizedSearch) ||
      student.email.toLowerCase().includes(normalizedSearch)
    const matchesStatus = filters.status === 'All' || student.status === filters.status

    return matchesSearch && matchesStatus
  })
}
