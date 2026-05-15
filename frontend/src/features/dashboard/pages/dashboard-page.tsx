import { AlertTriangle, CalendarClock, Dumbbell, Plus, Receipt, Route, ShieldAlert, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { UserRole } from '../../../shared/api/types'
import { formatCurrency, formatDateTime } from '../../../shared/lib/formatters'
import { canManagePayments, canManageStudents, canManageTrainings } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { EmptyState } from '../../../shared/ui/empty-state'
import { PageHeader } from '../../../shared/ui/page-header'
import { StatCard } from '../../../shared/ui/stat-card'
import { SurfaceCard } from '../../../shared/ui/surface-card'
import { useAuth } from '../../auth/hooks/use-auth'
import { usePayments } from '../../payments/hooks/use-payments'
import { usePlans } from '../../plans/hooks/use-plans'
import { useStudents } from '../../students/hooks/use-students'
import { useTrainings } from '../../trainings/hooks/use-trainings'
import { getDashboardInsights, type EnrichedPayment, type EnrichedTraining } from '../lib/dashboard-insights'

export function DashboardPage() {
  const { user } = useAuth()
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const plansQuery = usePlans({ page: 1, perPage: 100 })
  const trainingsQuery = useTrainings({ page: 1, perPage: 100 })
  const paymentsQuery = usePayments({ page: 1, perPage: 100 })

  const isLoading = studentsQuery.isLoading || plansQuery.isLoading || trainingsQuery.isLoading || paymentsQuery.isLoading
  const isError = studentsQuery.isError || plansQuery.isError || trainingsQuery.isError || paymentsQuery.isError
  const students = studentsQuery.data?.data ?? []
  const plans = plansQuery.data?.data ?? []
  const trainings = trainingsQuery.data?.data ?? []
  const payments = paymentsQuery.data?.data ?? []
  const insights = getDashboardInsights({ students, plans, trainings, payments })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Centro de comando"
        title="Hoje na academia"
        description="Priorize treinos, cobranças e alunos que precisam de atenção sem navegar por todas as tabelas."
        meta={
          <>
            <span>{studentsQuery.data?.total ?? 0} alunos no sistema</span>
            <span>{trainingsQuery.data?.total ?? 0} treinos cadastrados</span>
            <span>{paymentsQuery.data?.total ?? 0} cobranças registradas</span>
          </>
        }
        actions={<QuickActions role={user?.role} />}
      />

      {isLoading ? (
        <SurfaceCard className="p-6">
          <p className="text-sm text-slate-400">Carregando operação da academia...</p>
        </SurfaceCard>
      ) : null}

      {isError ? (
        <SurfaceCard className="border-red-300/30 p-6">
          <p className="text-sm font-medium text-red-200">Não foi possível carregar o dashboard operacional.</p>
          <Button
            className="mt-4"
            type="button"
            onClick={() => {
              studentsQuery.refetch()
              plansQuery.refetch()
              trainingsQuery.refetch()
              paymentsQuery.refetch()
            }}
          >
            Tentar novamente
          </Button>
        </SurfaceCard>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principais">
            <StatCard
              icon={Users}
              label="Alunos ativos"
              value={insights.activeStudents}
              description={`${insights.suspendedStudents} suspensos e ${insights.inactiveStudents} inativos`}
              to="/students?status=Active"
            />
            <StatCard
              icon={CalendarClock}
              label="Treinos hoje"
              value={insights.todaysTrainings.length}
              description="Agenda que exige acompanhamento no dia"
              tone="blue"
              to="/trainings"
            />
            <StatCard
              icon={Receipt}
              label="Receita do mês"
              value={formatCurrency(insights.monthlyRevenue, 'BRL')}
              description="Pagamentos marcados como pagos neste mês"
              tone="emerald"
              to="/payments?status=Paid"
            />
            <StatCard
              icon={ShieldAlert}
              label="Risco financeiro"
              value={insights.financialRiskCount}
              description="Cobranças pendentes ou vencidas"
              tone={insights.financialRiskCount > 0 ? 'red' : 'neutral'}
              to="/payments"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <TrainingBoard trainings={insights.upcomingTrainings} todaysCount={insights.todaysTrainings.length} />
            <FinancialBoard payments={insights.overduePayments} />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <OperationalCard
              icon={Dumbbell}
              title="Planos ativos"
              value={insights.activePlans}
              description="Ofertas disponíveis para vínculo com alunos."
              to="/plans"
            />
            <OperationalCard
              icon={AlertTriangle}
              title="Alunos suspensos"
              value={insights.suspendedStudents}
              description="Revise pendências antes de reativar acesso."
              to="/students?status=Suspended"
            />
            <OperationalCard
              icon={Route}
              title="Próximo treino"
              value={insights.upcomingTrainings[0] ? formatDateTime(insights.upcomingTrainings[0].scheduledForUtc) : 'Sem agenda'}
              description={insights.upcomingTrainings[0]?.studentName ?? 'Crie treinos para organizar a rotina.'}
              to="/trainings"
            />
          </section>
        </>
      ) : null}
    </div>
  )
}

function QuickActions({ role }: { role?: UserRole }) {
  return (
    <>
      {canManageStudents(role) ? (
        <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800" to="/students/new">
          <Plus size={17} />
          Novo aluno
        </Link>
      ) : null}
      {canManageTrainings(role) ? (
        <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50" to="/trainings/new">
          <CalendarClock size={17} />
          Agendar treino
        </Link>
      ) : null}
      {canManagePayments(role) ? (
        <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50" to="/payments/new">
          <Receipt size={17} />
          Registrar cobrança
        </Link>
      ) : null}
    </>
  )
}

function TrainingBoard({ trainings, todaysCount }: { trainings: EnrichedTraining[]; todaysCount: number }) {
  return (
    <SurfaceCard aria-labelledby="training-board-title">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">Agenda</p>
          <h2 id="training-board-title" className="mt-1 text-lg font-semibold text-slate-50">
            Próximos treinos
          </h2>
          <p className="mt-1 text-sm text-slate-400">{todaysCount} treino(s) marcados para hoje.</p>
        </div>
        <Link className="text-sm font-medium text-emerald-200 hover:text-emerald-100" to="/trainings">
          Ver agenda
        </Link>
      </div>

      {trainings.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={CalendarClock}
            title="Nenhum treino próximo"
            description="Agende treinos para transformar o dashboard em uma fila de trabalho diária."
            action={
              <Link className="inline-flex h-9 items-center rounded-md bg-emerald-700 px-3 text-sm font-medium text-white hover:bg-emerald-800" to="/trainings/new">
                Agendar treino
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {trainings.map((training) => (
            <li key={training.id}>
              <Link className="block px-5 py-4 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-300" to={`/trainings/${training.id}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{training.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{training.studentName}</p>
                    <p className="mt-1 text-xs text-slate-500">{training.description}</p>
                  </div>
                  <time className="text-sm font-medium text-slate-300" dateTime={training.scheduledForUtc}>
                    {formatDateTime(training.scheduledForUtc)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  )
}

function FinancialBoard({ payments }: { payments: EnrichedPayment[] }) {
  return (
    <SurfaceCard aria-labelledby="financial-board-title">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Financeiro</p>
        <h2 id="financial-board-title" className="mt-1 text-lg font-semibold text-slate-50">
          Cobranças críticas
        </h2>
        <p className="mt-1 text-sm text-slate-400">Pagamentos vencidos ou pendentes com data passada.</p>
      </div>

      {payments.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Receipt}
            title="Financeiro sem pendências críticas"
            description="Quando houver cobrança vencida, ela aparecerá aqui com acesso rápido ao pagamento."
            action={
              <Link className="inline-flex h-9 items-center rounded-md bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50" to="/payments">
                Ver pagamentos
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {payments.slice(0, 5).map((payment) => (
            <li key={payment.id}>
              <Link className="block px-5 py-4 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-300" to={`/payments/${payment.id}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{payment.studentName}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatCurrency(payment.amount, payment.currency)}</p>
                  </div>
                  <time className="text-right text-xs font-medium text-red-200" dateTime={payment.dueDateUtc}>
                    Venceu {formatDateTime(payment.dueDateUtc)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  )
}

function OperationalCard({
  icon: Icon,
  title,
  value,
  description,
  to,
}: {
  icon: typeof Dumbbell
  title: string
  value: string | number
  description: string
  to: string
}) {
  return (
    <Link to={to} className="block focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950">
      <SurfaceCard as="article" className="h-full p-5 transition hover:-translate-y-0.5 hover:border-white/20">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/20">
          <Icon size={18} aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </SurfaceCard>
    </Link>
  )
}
