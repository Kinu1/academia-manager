import { describe, expect, it } from 'vitest'

import { getStudentDetailData } from './student-detail'
import type { PaymentResponse } from '../../payments/types'
import type { PlanResponse } from '../../plans/types'
import type { TrainingResponse } from '../../trainings/types'
import type { StudentResponse } from '../types'

const student: StudentResponse = {
  id: 'student-1',
  name: 'Ana Silva',
  email: 'ana@example.com',
  status: 'Active',
  planId: 'plan-1',
  createdAtUtc: '2026-05-01T10:00:00.000Z',
}

const plans: PlanResponse[] = [
  {
    id: 'plan-1',
    name: 'Mensal',
    priceAmount: 129.9,
    priceCurrency: 'BRL',
    durationInDays: 30,
    isActive: true,
    createdAtUtc: '2026-04-01T10:00:00.000Z',
  },
]

const trainings: TrainingResponse[] = [
  {
    id: 'training-1',
    studentId: 'student-1',
    title: 'Treino superior',
    description: 'Peito e costas',
    scheduledForUtc: '2026-05-15T10:00:00.000Z',
    createdAtUtc: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 'training-2',
    studentId: 'student-2',
    title: 'Outro treino',
    description: 'Pernas',
    scheduledForUtc: '2026-05-16T10:00:00.000Z',
    createdAtUtc: '2026-05-02T10:00:00.000Z',
  },
]

const payments: PaymentResponse[] = [
  {
    id: 'payment-1',
    studentId: 'student-1',
    amount: 129.9,
    currency: 'BRL',
    dueDateUtc: '2026-05-15T10:00:00.000Z',
    status: 'Pending',
    createdAtUtc: '2026-05-03T10:00:00.000Z',
  },
  {
    id: 'payment-2',
    studentId: 'student-2',
    amount: 89.9,
    currency: 'BRL',
    dueDateUtc: '2026-05-15T10:00:00.000Z',
    status: 'Paid',
    paidAtUtc: '2026-05-10T10:00:00.000Z',
    createdAtUtc: '2026-05-03T10:00:00.000Z',
  },
]

describe('getStudentDetailData', () => {
  it('returns plan and related resources for one student', () => {
    const detail = getStudentDetailData(student, plans, trainings, payments)

    expect(detail.plan).toEqual(plans[0])
    expect(detail.trainings).toEqual([trainings[0]])
    expect(detail.payments).toEqual([payments[0]])
    expect(detail.pendingPayments).toEqual([payments[0]])
    expect(detail.totalPaid).toBe(0)
    expect(detail.timeline.map((item) => item.title)).toContain('Aluno cadastrado')
    expect(detail.timeline.map((item) => item.title)).toContain('Treino agendado')
  })
})
