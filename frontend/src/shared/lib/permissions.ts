import type { UserRole } from '../api/types'

export function canManagePlans(role?: UserRole) {
  return role === 'Admin'
}

export function canAssignStudentPlans(role?: UserRole) {
  return role === 'Admin' || role === 'Trainer'
}

export function canManagePayments(role?: UserRole) {
  return role === 'Admin'
}

export function canViewPayments(role?: UserRole) {
  return role === 'Admin'
}

export function canViewOwnPayments(role?: UserRole) {
  return role === 'Student'
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

export function getRoleLabel(role?: UserRole) {
  if (role === 'Admin') return 'Administrador'
  if (role === 'Trainer') return 'Treinador'
  if (role === 'Student') return 'Aluno'
  return 'Sem perfil'
}
