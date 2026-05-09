export type PaymentStatus = 'Pending' | 'Paid' | 'Overdue' | 'Canceled'

export type PaymentResponse = {
  id: string
  studentId: string
  amount: number
  currency: string
  dueDateUtc: string
  paidAtUtc?: string | null
  status: PaymentStatus
}

export type CreatePaymentRequest = {
  studentId: string
  amount: number
  dueDateUtc: string
}

export type UpdatePaymentRequest = {
  amount: number
  dueDateUtc: string
  status: PaymentStatus
}
