import { ArrowLeft, Edit, Mail, Phone, Plus, Receipt, Route, WalletCards } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { formatCurrency, formatDateTime } from '../../../shared/lib/formatters'
import { canManageStudents } from '../../../shared/lib/permissions'
import { Badge } from '../../../shared/ui/badge'
import { Button } from '../../../shared/ui/button'
import { useAuth } from '../../auth/hooks/use-auth'
import { usePayments } from '../../payments/hooks/use-payments'
import type { PaymentResponse, PaymentStatus } from '../../payments/types'
import { usePlans } from '../../plans/hooks/use-plans'
import type { PlanResponse } from '../../plans/types'
import { useTrainings } from '../../trainings/hooks/use-trainings'
import type { TrainingResponse } from '../../trainings/types'
import { useStudent } from '../hooks/use-students'
import { getStudentDetailData } from '../lib/student-detail'
import type { StudentResponse } from '../types'

const statusTone: Record<StudentResponse['status'], 'neutral' | 'success' | 'warning' | 'danger'> = {
  Active: 'success',
  Inactive: 'neutral',
  Suspended: 'warning',
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  Pending: 'Pendente',
  Paid: 'Pago',
  Overdue: 'Atrasado',
  Canceled: 'Cancelado',
}

const paymentStatusTones: Record<PaymentStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Pending: 'warning',
  Paid: 'success',
  Overdue: 'danger',
  Canceled: 'neutral',
}

export function StudentDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const canEdit = canManageStudents(user?.role)
  const studentQuery = useStudent(id)
  const plansQuery = usePlans({ page: 1, perPage: 100 })
  const trainingsQuery = useTrainings({ page: 1, perPage: 100 })
  const paymentsQuery = usePayments({ page: 1, perPage: 100 })

  const isLoading = studentQuery.isLoading || plansQuery.isLoading || trainingsQuery.isLoading || paymentsQuery.isLoading
  const isError = studentQuery.isError || plansQuery.isError || trainingsQuery.isError || paymentsQuery.isError
  const detail =
    studentQuery.data && plansQuery.data && trainingsQuery.data && paymentsQuery.data
      ? getStudentDetailData(studentQuery.data, plansQuery.data.data, trainingsQuery.data.data, paymentsQuery.data.data)
      : null

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        to="/students"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando aluno...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Não foi possível carregar os dados do aluno.</p>
          <Button
            className="mt-4"
            onClick={() => {
              studentQuery.refetch()
              plansQuery.refetch()
              trainingsQuery.refetch()
              paymentsQuery.refetch()
            }}
            type="button"
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {studentQuery.data && detail ? (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-slate-950">{studentQuery.data.name}</h1>
                  <Badge tone={statusTone[studentQuery.data.status]}>{studentQuery.data.status}</Badge>
                </div>
                <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} aria-hidden="true" />
                    <dt className="sr-only">E-mail</dt>
                    <dd>{studentQuery.data.email}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} aria-hidden="true" />
                    <dt className="sr-only">Telefone</dt>
                    <dd>{studentQuery.data.phone || 'Sem telefone'}</dd>
                  </div>
                </dl>
              </div>

              {canEdit ? (
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    to={`/trainings/new?studentId=${studentQuery.data.id}`}
                  >
                    <Plus size={17} />
                    Novo treino
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    to={`/payments/new?studentId=${studentQuery.data.id}`}
                  >
                    <Plus size={17} />
                    Novo pagamento
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
                    to={`/students/${studentQuery.data.id}/edit`}
                  >
                    <Edit size={17} />
                    Editar aluno
                  </Link>
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <PlanSummary plan={detail.plan} />
            <CountSummary icon={Route} label="Treinos" description="Total vinculado" value={detail.trainings.length} />
            <CountSummary
              icon={Receipt}
              label="Pagamentos"
              description="Total vinculado"
              value={detail.payments.length}
              tone="warning"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <StudentTrainings trainings={detail.trainings} />
            <StudentPayments payments={detail.payments} />
          </section>
        </>
      ) : null}
    </div>
  )
}

function PlanSummary({ plan }: { plan?: PlanResponse }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <WalletCards size={18} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Plano atual</h2>
          <p className="text-xs text-slate-500">Vínculo comercial.</p>
        </div>
      </div>
      {plan ? (
        <div className="mt-4 space-y-1 text-sm text-slate-700">
          <p className="font-medium text-slate-950">{plan.name}</p>
          <p>{formatCurrency(plan.priceAmount, plan.priceCurrency)}</p>
          <p>{plan.durationInDays} dias</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Aluno sem plano vinculado.</p>
      )}
    </article>
  )
}

function CountSummary({
  icon: Icon,
  label,
  description,
  value,
  tone = 'success',
}: {
  icon: typeof Route
  label: string
  description: string
  value: number
  tone?: 'success' | 'warning'
}) {
  const toneClass = tone === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-md ${toneClass}`}>
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-950">{label}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
    </article>
  )
}

function StudentTrainings({ trainings }: { trainings: TrainingResponse[] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-950">Treinos do aluno</h2>
      </header>
      {trainings.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-600">Nenhum treino vinculado.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {trainings.map((training) => (
            <li key={training.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-950">{training.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{training.description}</p>
                </div>
                <time
                  className="shrink-0 text-right text-xs font-medium text-slate-600"
                  dateTime={training.scheduledForUtc}
                >
                  {formatDateTime(training.scheduledForUtc)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function StudentPayments({ payments }: { payments: PaymentResponse[] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-950">Pagamentos do aluno</h2>
      </header>
      {payments.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-600">Nenhum pagamento vinculado.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <li key={payment.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-950">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Vence em {formatDateTime(payment.dueDateUtc)}</p>
                </div>
                <Badge tone={paymentStatusTones[payment.status]}>{paymentStatusLabels[payment.status]}</Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
