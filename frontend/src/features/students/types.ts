import type { StudentStatus } from '../../shared/api/types'

export type StudentResponse = {
  id: string
  name: string
  email: string
  phone?: string | null
  status: StudentStatus
  planId?: string | null
}

export type CreateStudentRequest = {
  name: string
  email: string
  phone?: string | null
  planId?: string | null
}

export type UpdateStudentRequest = CreateStudentRequest & {
  status: StudentStatus
}
