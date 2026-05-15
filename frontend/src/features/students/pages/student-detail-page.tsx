import { ArrowLeft, CalendarClock, Edit, History, Mail, Phone, Plus, Receipt, Route, WalletCards } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { formatCurrency, formatDateTime } from '../../../shared/lib/formatters'
import { canManagePayments, canManageStudents } from '../../../shared/lib/permissions'
import { Badge } from '../../../shared/ui/badge'
import { Button } from '../../../shared/ui/button'
import { PageHeader } from '../../../shared/ui/page-header'
import { StatCard } from '../../../shared/ui/stat-card'
import { SurfaceCard } from '../../../shared/ui/surface-card'
import { Timeline } from '../../../shared/ui/timeline'
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

type StudentDetail = ReturnType<typeof getStudentDetailData>

export function StudentDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const canEdit = canManageStudents(user?.role)
  const canViewFinancial = canManagePayments(user?.role)
  const studentQuery = useStudent(id, { enabled: canEdit })
  const plansQuery = usePlans({ page: 1, perPage: 100 }, { enabled: canEdit })
  const trainingsQuery = useTrainings({ page: 1, perPage: 100 }, { enabled: canEdit })
  const paymentsQuery = usePayments({ page: 1, perPage: 100 }, { enabled: canViewFinancial })

  if (!canEdit) {
    return <Navigate to="/plans" replace />
  }

  const isLoading = studentQuery.isLoading || plansQuery.isLoading || trainingsQuery.isLoading || (canViewFinancial && paymentsQuery.isLoading)
  const isError = studentQuery.isError || plansQuery.isError || trainingsQuery.isError || (canViewFinancial && paymentsQuery.isError)
  const detail =
    studentQuery.data && plansQuery.data && trainingsQuery.data
      ? getStudentDetailData(studentQuery.data, plansQuery.data.data, trainingsQuery.data.data, canViewFinancial ? paymentsQuery.data?.data ?? [] : [])
      : null

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-50" to="/students">
        <ArrowLeft size={16} />
        Voltar
      </Link>

      {isLoading ? (
        <SurfaceCard className="p-6">
          <p className="text-sm text-slate-400">Carregando aluno...</p>
        </SurfaceCard>
      ) : null}

      {isError ? (
        <SurfaceCard className="border-red-300/30 p-6">
          <p className="text-sm font-medium text-red-200">Não foi possível carregar os dados do aluno.</p>
          <Button
            className="mt-4"
            onClick={() => {
              studentQuery.refetch()
              plansQuery.refetch()
              trainingsQuery.refetch()
              if (canViewFinancial) paymentsQuery.refetch()
            }}
            type="button"
          >
            Tentar novamente
          </Button>
        </SurfaceCard>
      ) : null}

      {studentQuery.data && detail ? (
        <StudentProfile student={studentQuery.data} detail={detail} canEdit={canEdit} canViewFinancial={canViewFinancial} />
      ) : null}
    </div>
  )
}

function StudentProfile({
  student,
  detail,
  canEdit,
  canViewFinancial,
}: {
  student: StudentResponse
  detail: StudentDetail
  canEdit: boolean
  canViewFinancial: boolean
}) {
  return (
    <>
      <PageHeader
        eyebrow="Perfil 360"
        title={student.name}
        description="Visão unificada do vínculo comercial, treinos, cobranças e histórico operacional do aluno."
        meta={
          <>
            <Badge tone={statusTone[student.status]}>{student.status}</Badge>
            <span className="inline-flex items-center gap-2">
              <Mail size={15} aria-hidden="true" />
              {student.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone size={15} aria-hidden="true" />
              {student.phone || 'Sem telefone'}
            </span>
          </>
        }
        actions={canEdit ? <StudentActions studentId={student.id} canViewFinancial={canViewFinancial} /> : null}
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <PlanSummary plan={detail.plan} />
        <StatCard
          icon={Route}
          label="Treinos"
          value={detail.trainings.length}
          description={detail.nextTraining ? `Próximo: ${formatDateTime(detail.nextTraining.scheduledForUtc)}` : 'Nenhum treino futuro'}
          tone="blue"
        />
        {canViewFinancial ? (
          <>
            <StatCard
          icon={Receipt}
          label="Pendências"
          value={detail.pendingPayments.length + detail.overduePayments.length}
          description={`${detail.overduePayments.length} atrasado(s)`}
          tone={detail.overduePayments.length > 0 ? 'red' : 'amber'}
        />
            <StatCard
          icon={WalletCards}
          label="Total pago"
          value={formatCurrency(detail.totalPaid)}
          description="Histórico financeiro recebido"
            />
          </>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <StudentTimeline items={detail.timeline} />
        <StudentTrainings trainings={detail.trainings} />
        {canViewFinancial ? <StudentPayments payments={detail.payments} /> : null}
      </section>
    </>
  )
}

function StudentActions({ studentId, canViewFinancial }: { studentId: string; canViewFinancial: boolean }) {
  return (
    <>
      <Link
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        to={`/trainings/new?studentId=${studentId}`}
      >
        <Plus size={17} />
        Novo treino
      </Link>
      {canViewFinancial ? (
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          to={`/payments/new?studentId=${studentId}`}
        >
          <Plus size={17} />
          Novo pagamento
        </Link>
      ) : null}
      <Link
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
        to={`/students/${studentId}/edit`}
      >
        <Edit size={17} />
        Editar aluno
      </Link>
    </>
  )
}

function PlanSummary({ plan }: { plan?: PlanResponse }) {
  return (
    <SurfaceCard as="article" className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/20">
          <WalletCards size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Plano atual</h2>
          <p className="text-xs text-slate-400">Vínculo comercial.</p>
        </div>
      </div>
      {plan ? (
        <div className="mt-4 space-y-1 text-sm text-slate-300">
          <p className="font-medium text-slate-50">{plan.name}</p>
          <p>{formatCurrency(plan.priceAmount, plan.priceCurrency)}</p>
          <p>{plan.durationInDays} dias</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Aluno sem plano vinculado.</p>
      )}
    </SurfaceCard>
  )
}

function StudentTimeline({ items }: { items: StudentDetail['timeline'] }) {
  return (
    <SurfaceCard as="article" className="p-5">
      <header className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-400/12 text-slate-200 ring-1 ring-slate-300/20">
          <History size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Linha do tempo</h2>
          <p className="text-xs text-slate-400">Eventos operacionais do aluno.</p>
        </div>
      </header>
      <Timeline items={items} />
    </SurfaceCard>
  )
}

function StudentTrainings({ trainings }: { trainings: TrainingResponse[] }) {
  return (
    <SurfaceCard as="article">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-400/12 text-sky-200 ring-1 ring-sky-300/20">
          <CalendarClock size={17} aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold text-slate-50">Treinos do aluno</h2>
      </header>
      {trainings.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">Nenhum treino vinculado.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {trainings.map((training) => (
            <li key={training.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-50">{training.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{training.description}</p>
                </div>
                <time className="shrink-0 text-right text-xs font-medium text-slate-300" dateTime={training.scheduledForUtc}>
                  {formatDateTime(training.scheduledForUtc)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  )
}

function StudentPayments({ payments }: { payments: PaymentResponse[] }) {
  return (
    <SurfaceCard as="article">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-200 ring-1 ring-amber-300/20">
          <Receipt size={17} aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold text-slate-50">Pagamentos do aluno</h2>
      </header>
      {payments.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">Nenhum pagamento vinculado.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {payments.map((payment) => (
            <li key={payment.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-50">{formatCurrency(payment.amount, payment.currency)}</p>
                  <p className="mt-1 text-xs text-slate-400">Vence em {formatDateTime(payment.dueDateUtc)}</p>
                </div>
                <Badge tone={paymentStatusTones[payment.status]}>{paymentStatusLabels[payment.status]}</Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  )
}
