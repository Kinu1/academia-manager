import { toDateInputValue } from '../../../shared/lib/formatters'
import { compareDate, compareText, type SortDirection } from '../../../shared/lib/sorting'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../types'

export type TrainingSortField = 'title' | 'student' | 'scheduledForUtc'

export type TrainingFilters = {
  search: string
  scheduledDate: string
  sort?: TrainingSortField
  sortDir?: SortDirection
}

export function filterTrainings(trainings: TrainingResponse[], students: StudentResponse[], filters: TrainingFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase()
  const studentsById = new Map(students.map((student) => [student.id, student]))

  return trainings.filter((training) => {
    const student = studentsById.get(training.studentId)
    const matchesSearch =
      normalizedSearch.length === 0 ||
      training.title.toLowerCase().includes(normalizedSearch) ||
      training.description.toLowerCase().includes(normalizedSearch) ||
      student?.name.toLowerCase().includes(normalizedSearch)
    const matchesDate =
      filters.scheduledDate.length === 0 || toDateInputValue(training.scheduledForUtc) === filters.scheduledDate

    return matchesSearch && matchesDate
  })
}

export function sortTrainings(
  trainings: TrainingResponse[],
  students: StudentResponse[],
  filters: Pick<TrainingFilters, 'sort' | 'sortDir'>,
) {
  const sort = filters.sort ?? 'scheduledForUtc'
  const sortDir = filters.sortDir ?? 'asc'
  const studentNames = new Map(students.map((student) => [student.id, student.name]))

  return [...trainings].sort((left, right) => {
    if (sort === 'title') {
      return compareText(left.title, right.title, sortDir)
    }

    if (sort === 'student') {
      return compareText(studentNames.get(left.studentId) ?? '', studentNames.get(right.studentId) ?? '', sortDir)
    }

    return compareDate(left.scheduledForUtc, right.scheduledForUtc, sortDir)
  })
}
