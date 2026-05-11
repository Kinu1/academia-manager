import type { StudentStatus } from '../../../shared/api/types'
import { compareText, type SortDirection } from '../../../shared/lib/sorting'
import type { StudentResponse } from '../types'

export type StudentStatusFilter = StudentStatus | 'All'
export type StudentSortField = 'name' | 'email' | 'status'

export type StudentFilters = {
  search: string
  status: StudentStatusFilter
  sort?: StudentSortField
  sortDir?: SortDirection
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

export function sortStudents(students: StudentResponse[], filters: Pick<StudentFilters, 'sort' | 'sortDir'>) {
  const sort = filters.sort ?? 'name'
  const sortDir = filters.sortDir ?? 'asc'

  return [...students].sort((left, right) => {
    if (sort === 'email') {
      return compareText(left.email, right.email, sortDir)
    }

    if (sort === 'status') {
      return compareText(left.status, right.status, sortDir)
    }

    return compareText(left.name, right.name, sortDir)
  })
}
