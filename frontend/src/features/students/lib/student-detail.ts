import type { PaymentResponse } from '../../payments/types'
import type { PlanResponse } from '../../plans/types'
import type { TrainingResponse } from '../../trainings/types'
import type { StudentResponse } from '../types'

export type StudentTimelineItem = {
  id: string
  title: string
  description: string
  timestamp: string
  tone: 'emerald' | 'amber' | 'red' | 'neutral'
}

export function getStudentDetailData(
  student: StudentResponse,
  plans: PlanResponse[],
  trainings: TrainingResponse[],
  payments: PaymentResponse[],
) {
  const studentTrainings = trainings
    .filter((training) => training.studentId === student.id)
    .sort((left, right) => new Date(left.scheduledForUtc).getTime() - new Date(right.scheduledForUtc).getTime())
  const studentPayments = payments
    .filter((payment) => payment.studentId === student.id)
    .sort((left, right) => new Date(right.dueDateUtc).getTime() - new Date(left.dueDateUtc).getTime())
  const pendingPayments = studentPayments.filter((payment) => payment.status === 'Pending')
  const overduePayments = studentPayments.filter((payment) => payment.status === 'Overdue')
  const paidPayments = studentPayments.filter((payment) => payment.status === 'Paid')
  const now = new Date()

  return {
    plan: student.planId ? plans.find((plan) => plan.id === student.planId) : undefined,
    trainings: studentTrainings,
    payments: studentPayments,
    pendingPayments,
    overduePayments,
    paidPayments,
    totalPaid: paidPayments.reduce((total, payment) => total + payment.amount, 0),
    nextTraining: studentTrainings.find((training) => new Date(training.scheduledForUtc) >= now),
    nextDuePayment: pendingPayments
      .slice()
      .sort((left, right) => new Date(left.dueDateUtc).getTime() - new Date(right.dueDateUtc).getTime())[0],
    timeline: getStudentTimeline(student, studentTrainings, studentPayments),
  }
}

function getStudentTimeline(student: StudentResponse, trainings: TrainingResponse[], payments: PaymentResponse[]) {
  const eventCandidates: Array<StudentTimelineItem | undefined> = [
    student.createdAtUtc
      ? {
          id: `student-created-${student.id}`,
          title: 'Aluno cadastrado',
          description: 'Cadastro criado na base da academia.',
          timestamp: student.createdAtUtc,
          tone: 'emerald' as const,
        }
      : undefined,
    student.updatedAtUtc
      ? {
          id: `student-updated-${student.id}`,
          title: 'Cadastro atualizado',
          description: 'Dados cadastrais revisados pela equipe.',
          timestamp: student.updatedAtUtc,
          tone: 'neutral' as const,
        }
      : undefined,
    ...trainings.map((training) => ({
      id: `training-${training.id}`,
      title: 'Treino agendado',
      description: training.title,
      timestamp: training.scheduledForUtc,
      tone: 'emerald' as const,
    })),
    ...payments.map((payment) => ({
      id: `payment-${payment.id}`,
      title: payment.status === 'Paid' ? 'Pagamento recebido' : 'Cobrança registrada',
      description: `${payment.currency} ${payment.amount.toFixed(2)} - ${payment.status}`,
      timestamp: payment.paidAtUtc ?? payment.dueDateUtc,
      tone: payment.status === 'Overdue' ? ('red' as const) : payment.status === 'Pending' ? ('amber' as const) : ('emerald' as const),
    })),
  ]
  const events = eventCandidates.filter(isStudentTimelineItem)

  return events.sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
}

function isStudentTimelineItem(item: StudentTimelineItem | undefined): item is StudentTimelineItem {
  return item !== undefined
}
