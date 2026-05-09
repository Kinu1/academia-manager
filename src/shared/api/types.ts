export type UserRole = 'Admin' | 'Trainer' | 'Student'
export type StudentStatus = 'Active' | 'Inactive' | 'Suspended'
export type PaymentStatus = 'Pending' | 'Paid' | 'Overdue' | 'Canceled'

export type ApiResponse<T> = {
  data: T
}

export type PagedResult<T> = {
  data: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type ApiErrorResponse = {
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
      code: string
    }>
  }
}
