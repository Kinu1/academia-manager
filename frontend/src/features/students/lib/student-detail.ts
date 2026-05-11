import type { PaymentResponse } from '../../payments/types'
import type { PlanResponse } from '../../plans/types'
import type { TrainingResponse } from '../../trainings/types'
import type { StudentResponse } from '../types'

export function getStudentDetailData(
  student: StudentResponse,
  plans: PlanResponse[],
  trainings: TrainingResponse[],
  payments: PaymentResponse[],
) {
  return {
    plan: student.planId ? plans.find((plan) => plan.id === student.planId) : undefined,
    trainings: trainings.filter((training) => training.studentId === student.id),
    payments: payments.filter((payment) => payment.studentId === student.id),
  }
}
