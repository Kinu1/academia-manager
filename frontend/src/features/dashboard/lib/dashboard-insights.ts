import type { PaymentResponse } from '../../payments/types'
import type { PlanResponse } from '../../plans/types'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../../trainings/types'

type DashboardInsightInput = {
  students: StudentResponse[]
  plans: PlanResponse[]
  trainings: TrainingResponse[]
  payments: PaymentResponse[]
  now?: Date
}

export type EnrichedTraining = TrainingResponse & {
  studentName: string
}

export type EnrichedPayment = PaymentResponse & {
  studentName: string
}

export function getDashboardInsights({
  students,
  plans,
  trainings,
  payments,
  now = new Date(),
}: DashboardInsightInput) {
  const studentNames = new Map(students.map((student) => [student.id, student.name]))
  const todayStart = startOfDay(now)
  const tomorrowStart = addDays(todayStart, 1)
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  const activeStudents = students.filter((student) => student.status === 'Active').length
  const suspendedStudents = students.filter((student) => student.status === 'Suspended').length
  const inactiveStudents = students.filter((student) => student.status === 'Inactive').length
  const activePlans = plans.filter((plan) => plan.isActive).length

  const enrichedTrainings = trainings.map((training) => ({
    ...training,
    studentName: studentNames.get(training.studentId) ?? 'Aluno removido',
  }))

  const todaysTrainings = enrichedTrainings
    .filter((training) => {
      const scheduledFor = new Date(training.scheduledForUtc)
      return scheduledFor >= todayStart && scheduledFor < tomorrowStart
    })
    .sort(sortByDate('scheduledForUtc', 'asc'))

  const upcomingTrainings = enrichedTrainings
    .filter((training) => new Date(training.scheduledForUtc) >= now)
    .sort(sortByDate('scheduledForUtc', 'asc'))
    .slice(0, 5)

  const enrichedPayments = payments.map((payment) => ({
    ...payment,
    studentName: studentNames.get(payment.studentId) ?? 'Aluno removido',
  }))

  const pendingPayments = enrichedPayments.filter((payment) => payment.status === 'Pending')
  const overduePayments = enrichedPayments
    .filter((payment) => payment.status === 'Overdue' || (payment.status === 'Pending' && new Date(payment.dueDateUtc) < todayStart))
    .sort(sortByDate('dueDateUtc', 'asc'))

  const monthlyRevenue = payments
    .filter((payment) => {
      if (payment.status !== 'Paid') return false
      const referenceDate = new Date(payment.paidAtUtc ?? payment.dueDateUtc)
      return referenceDate >= monthStart && referenceDate < nextMonthStart
    })
    .reduce((total, payment) => total + payment.amount, 0)
  const financialRiskIds = new Set([...pendingPayments, ...overduePayments].map((payment) => payment.id))

  return {
    activeStudents,
    suspendedStudents,
    inactiveStudents,
    activePlans,
    todaysTrainings,
    upcomingTrainings,
    pendingPayments,
    overduePayments,
    financialRiskCount: financialRiskIds.size,
    monthlyRevenue,
  }
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function sortByDate<T extends Record<K, string>, K extends keyof T>(field: K, direction: 'asc' | 'desc') {
  return (left: T, right: T) => {
    const diff = new Date(left[field]).getTime() - new Date(right[field]).getTime()
    return direction === 'asc' ? diff : -diff
  }
}
