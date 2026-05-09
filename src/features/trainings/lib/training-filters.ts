import { toDateInputValue } from '../../../shared/lib/formatters'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../types'

export type TrainingFilters = {
  search: string
  scheduledDate: string
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
