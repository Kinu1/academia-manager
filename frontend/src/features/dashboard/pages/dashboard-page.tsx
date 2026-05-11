import { useQuery } from '@tanstack/react-query'
import { Dumbbell, Receipt, Route, Users } from 'lucide-react'

import { httpClient } from '../../../shared/api/http-client'
import type { PagedResult } from '../../../shared/api/types'
import { usePayments } from '../../payments/hooks/use-payments'
import { useStudents } from '../../students/hooks/use-students'
import { useTrainings } from '../../trainings/hooks/use-trainings'
import { MetricCard } from '../components/metric-card'
import { PaymentAlerts } from '../components/payment-alerts'
import { RecentTrainings } from '../components/recent-trainings'

type Resource = 'students' | 'plans' | 'trainings' | 'payments'

async function getResourceTotal(resource: Resource) {
  const response = await httpClient.get<PagedResult<unknown>>(`/api/v1/${resource}`, {
    params: { page: 1, perPage: 1 },
  })

  return response.data.total
}

export function DashboardPage() {
  const students = useQuery({ queryKey: ['dashboard', 'students'], queryFn: () => getResourceTotal('students') })
  const plans = useQuery({ queryKey: ['dashboard', 'plans'], queryFn: () => getResourceTotal('plans') })
  const trainings = useQuery({ queryKey: ['dashboard', 'trainings'], queryFn: () => getResourceTotal('trainings') })
  const payments = useQuery({ queryKey: ['dashboard', 'payments'], queryFn: () => getResourceTotal('payments') })
  const recentTrainings = useTrainings({ page: 1, perPage: 5 })
  const paymentAlerts = usePayments({ page: 1, perPage: 10 })
  const studentsList = useStudents({ page: 1, perPage: 100 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Resumo operacional da academia.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Alunos" value={students.data} isLoading={students.isLoading} to="/students" />
        <MetricCard icon={Dumbbell} label="Planos" value={plans.data} isLoading={plans.isLoading} to="/plans" />
        <MetricCard icon={Route} label="Treinos" value={trainings.data} isLoading={trainings.isLoading} to="/trainings" />
        <MetricCard icon={Receipt} label="Pagamentos" value={payments.data} isLoading={payments.isLoading} to="/payments" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <RecentTrainings
          trainings={recentTrainings.data?.data ?? []}
          students={studentsList.data?.data ?? []}
          isLoading={recentTrainings.isLoading || studentsList.isLoading}
          isError={recentTrainings.isError || studentsList.isError}
        />
        <PaymentAlerts
          payments={paymentAlerts.data?.data ?? []}
          students={studentsList.data?.data ?? []}
          isLoading={paymentAlerts.isLoading || studentsList.isLoading}
          isError={paymentAlerts.isError || studentsList.isError}
        />
      </section>
    </div>
  )
}
