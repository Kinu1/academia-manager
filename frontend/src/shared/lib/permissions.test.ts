import { describe, expect, it } from 'vitest'

import {
  canAssignStudentPlans,
  canDeleteStudents,
  canManagePayments,
  canManagePlans,
  canManageStudents,
  canManageTrainings,
  canViewOwnPayments,
  canViewPayments,
} from './permissions'

describe('plan permissions', () => {
  it('allows only admin to manage plans', () => {
    expect(canManagePlans('Admin')).toBe(true)
    expect(canManagePlans('Trainer')).toBe(false)
    expect(canManagePlans('Student')).toBe(false)
    expect(canManagePlans(undefined)).toBe(false)
  })
})

describe('payment permissions', () => {
  it('allows only admin to manage payments', () => {
    expect(canManagePayments('Admin')).toBe(true)
    expect(canManagePayments('Trainer')).toBe(false)
    expect(canManagePayments('Student')).toBe(false)
    expect(canManagePayments(undefined)).toBe(false)
  })

  it('allows only admin to view operational payments', () => {
    expect(canViewPayments('Admin')).toBe(true)
    expect(canViewPayments('Trainer')).toBe(false)
    expect(canViewPayments('Student')).toBe(false)
  })

  it('allows only students to view their own payments', () => {
    expect(canViewOwnPayments('Admin')).toBe(false)
    expect(canViewOwnPayments('Trainer')).toBe(false)
    expect(canViewOwnPayments('Student')).toBe(true)
  })
})

describe('training permissions', () => {
  it('allows admin and trainer to manage trainings', () => {
    expect(canManageTrainings('Admin')).toBe(true)
    expect(canManageTrainings('Trainer')).toBe(true)
    expect(canManageTrainings('Student')).toBe(false)
  })
})

describe('student permissions', () => {
  it('allows admin and trainer to manage students', () => {
    expect(canManageStudents('Admin')).toBe(true)
    expect(canManageStudents('Trainer')).toBe(true)
    expect(canManageStudents('Student')).toBe(false)
  })

  it('allows only admin to delete students', () => {
    expect(canDeleteStudents('Admin')).toBe(true)
    expect(canDeleteStudents('Trainer')).toBe(false)
    expect(canDeleteStudents('Student')).toBe(false)
  })

  it('allows admin and trainer to assign plans to students', () => {
    expect(canAssignStudentPlans('Admin')).toBe(true)
    expect(canAssignStudentPlans('Trainer')).toBe(true)
    expect(canAssignStudentPlans('Student')).toBe(false)
  })
})
