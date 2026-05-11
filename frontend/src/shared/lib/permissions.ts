import type { UserRole } from '../api/types'

export function canManagePlans(role?: UserRole) {
  return role === 'Admin'
}

export function canManagePayments(role?: UserRole) {
  return role === 'Admin'
}

export function canManageStudents(role?: UserRole) {
  return role === 'Admin' || role === 'Trainer'
}

export function canDeleteStudents(role?: UserRole) {
  return role === 'Admin'
}

export function canManageTrainings(role?: UserRole) {
  return role === 'Admin' || role === 'Trainer'
}
