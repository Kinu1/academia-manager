import { describe, expect, it } from 'vitest'

import { getDashboardInsights } from './dashboard-insights'
import type { PaymentResponse } from '../../payments/types'
import type { PlanResponse } from '../../plans/types'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../../trainings/types'

const now = new Date('2026-05-15T12:00:00.000Z')

const students: StudentResponse[] = [
  {
    id: 'student-1',
    name: 'Ana Lima',
    email: 'ana@example.com',
    status: 'Active',
    planId: 'plan-1',
    createdAtUtc: '2026-05-01T10:00:00.000Z',
    updatedAtUtc: null,
  },
  {
    id: 'student-2',
    name: 'Bruno Costa',
    email: 'bruno@example.com',
    status: 'Suspended',
    planId: null,
    createdAtUtc: '2026-05-02T10:00:00.000Z',
    updatedAtUtc: null,
  },
]

const plans: PlanResponse[] = [
  {
    id: 'plan-1',
    name: 'Mensal',
    priceAmount: 129.9,
    priceCurrency: 'BRL',
    durationInDays: 30,
    isActive: true,
    createdAtUtc: '2026-04-01T10:00:00.000Z',
    updatedAtUtc: null,
  },
]

const trainings: TrainingResponse[] = [
  {
    id: 'training-1',
    studentId: 'student-1',
    title: 'Treino de forca',
    description: 'Superior',
    scheduledForUtc: '2026-05-15T18:00:00.000Z',
    createdAtUtc: '2026-05-10T10:00:00.000Z',
    updatedAtUtc: null,
  },
  {
    id: 'training-2',
    studentId: 'student-2',
    title: 'Treino funcional',
    description: 'Condicionamento',
    scheduledForUtc: '2026-05-16T09:00:00.000Z',
    createdAtUtc: '2026-05-10T10:00:00.000Z',
    updatedAtUtc: null,
  },
]

const payments: PaymentResponse[] = [
  {
    id: 'payment-1',
    studentId: 'student-1',
    amount: 129.9,
    currency: 'BRL',
    dueDateUtc: '2026-05-10T12:00:00.000Z',
    paidAtUtc: null,
    status: 'Overdue',
    createdAtUtc: '2026-05-01T10:00:00.000Z',
    updatedAtUtc: null,
  },
  {
    id: 'payment-2',
    studentId: 'student-2',
    amount: 149.9,
    currency: 'BRL',
    dueDateUtc: '2026-05-20T12:00:00.000Z',
    paidAtUtc: '2026-05-11T12:00:00.000Z',
    status: 'Paid',
    createdAtUtc: '2026-05-01T10:00:00.000Z',
    updatedAtUtc: null,
  },
]

describe('getDashboardInsights', () => {
  it('summarizes operational metrics for the current day', () => {
    const insights = getDashboardInsights({ students, plans, trainings, payments, now })

    expect(insights.activeStudents).toBe(1)
    expect(insights.suspendedStudents).toBe(1)
    expect(insights.activePlans).toBe(1)
    expect(insights.todaysTrainings).toHaveLength(1)
    expect(insights.upcomingTrainings[0]?.studentName).toBe('Ana Lima')
    expect(insights.overduePayments).toHaveLength(1)
    expect(insights.monthlyRevenue).toBe(149.9)
  })

  it('treats pending payments with past due dates as financial risk', () => {
    const pendingPastDue: PaymentResponse = {
      ...payments[1],
      id: 'payment-3',
      status: 'Pending',
      paidAtUtc: null,
      dueDateUtc: '2026-05-01T12:00:00.000Z',
    }

    const insights = getDashboardInsights({
      students,
      plans,
      trainings,
      payments: [pendingPastDue],
      now,
    })

    expect(insights.overduePayments).toHaveLength(1)
    expect(insights.financialRiskCount).toBe(1)
  })
})
