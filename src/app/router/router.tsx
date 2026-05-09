import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './protected-route'

export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => ({ Component: (await import('../../features/auth/pages/login-page')).LoginPage }),
  },
  {
    path: '/register',
    lazy: async () => ({ Component: (await import('../../features/auth/pages/register-page')).RegisterPage }),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('../../features/dashboard/pages/dashboard-page')).DashboardPage }),
      },
      {
        path: 'students',
        lazy: async () => ({ Component: (await import('../../features/students/pages/students-page')).StudentsPage }),
      },
      {
        path: 'students/new',
        lazy: async () => ({
          Component: (await import('../../features/students/pages/student-form-page')).StudentFormPage,
        }),
      },
      {
        path: 'students/:id',
        lazy: async () => ({
          Component: (await import('../../features/students/pages/student-form-page')).StudentFormPage,
        }),
      },
      {
        path: 'plans',
        lazy: async () => ({ Component: (await import('../../features/plans/pages/plans-page')).PlansPage }),
      },
      {
        path: 'plans/new',
        lazy: async () => ({ Component: (await import('../../features/plans/pages/plan-form-page')).PlanFormPage }),
      },
      {
        path: 'plans/:id',
        lazy: async () => ({ Component: (await import('../../features/plans/pages/plan-form-page')).PlanFormPage }),
      },
      {
        path: 'trainings',
        lazy: async () => ({
          Component: (await import('../../features/trainings/pages/trainings-page')).TrainingsPage,
        }),
      },
      {
        path: 'trainings/new',
        lazy: async () => ({
          Component: (await import('../../features/trainings/pages/training-form-page')).TrainingFormPage,
        }),
      },
      {
        path: 'trainings/:id',
        lazy: async () => ({
          Component: (await import('../../features/trainings/pages/training-form-page')).TrainingFormPage,
        }),
      },
      {
        path: 'payments',
        lazy: async () => ({ Component: (await import('../../features/payments/pages/payments-page')).PaymentsPage }),
      },
      {
        path: 'payments/new',
        lazy: async () => ({
          Component: (await import('../../features/payments/pages/payment-form-page')).PaymentFormPage,
        }),
      },
      {
        path: 'payments/:id',
        lazy: async () => ({
          Component: (await import('../../features/payments/pages/payment-form-page')).PaymentFormPage,
        }),
      },
    ],
  },
])
