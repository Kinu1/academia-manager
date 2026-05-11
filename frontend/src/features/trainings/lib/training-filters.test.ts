import { describe, expect, it } from 'vitest'

import { filterTrainings, sortTrainings } from './training-filters'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../types'

const trainings: TrainingResponse[] = [
  {
    id: 'training-1',
    studentId: 'student-1',
    title: 'Treino superior',
    description: 'Peito e costas',
    scheduledForUtc: '2026-05-15T10:00:00.000Z',
  },
  {
    id: 'training-2',
    studentId: 'student-2',
    title: 'Treino inferior',
    description: 'Pernas',
    scheduledForUtc: '2026-05-16T10:00:00.000Z',
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
    status: 'Active',
  },
]

describe('filterTrainings', () => {
  it('filters by title', () => {
    expect(filterTrainings(trainings, students, { search: 'superior', scheduledDate: '' })).toEqual([trainings[0]])
  })

  it('filters by student name', () => {
    expect(filterTrainings(trainings, students, { search: 'bruno', scheduledDate: '' })).toEqual([trainings[1]])
  })

  it('filters by scheduled date', () => {
    expect(filterTrainings(trainings, students, { search: '', scheduledDate: '2026-05-15' })).toEqual([trainings[0]])
  })

  it('sorts by scheduled date descending', () => {
    expect(sortTrainings(trainings, students, { sort: 'scheduledForUtc', sortDir: 'desc' })).toEqual([
      trainings[1],
      trainings[0],
    ])
  })
})
