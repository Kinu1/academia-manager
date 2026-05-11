import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatCurrency, formatDateTime } from '../../../shared/lib/formatters'
import { Badge } from '../../../shared/ui/badge'
import type { PaymentResponse, PaymentStatus } from '../../payments/types'
import type { StudentResponse } from '../../students/types'

type PaymentAlertsProps = {
  payments: PaymentResponse[]
  students: StudentResponse[]
  isLoading: boolean
  isError: boolean
}

const statusLabels: Record<PaymentStatus, string> = {
  Pending: 'Pendente',
  Paid: 'Pago',
  Overdue: 'Atrasado',
  Canceled: 'Cancelado',
}

const statusTones: Record<PaymentStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Pending: 'warning',
  Paid: 'success',
  Overdue: 'danger',
  Canceled: 'neutral',
}

export function PaymentAlerts({ payments, students, isLoading, isError }: PaymentAlertsProps) {
  const studentNames = new Map(students.map((student) => [student.id, student.name]))
  const alertPayments = payments.filter((payment) => payment.status === 'Pending' || payment.status === 'Overdue')

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm" aria-labelledby="payment-alerts-title">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-amber-700">
            <AlertTriangle size={18} />
          </span>
          <div>
            <h2 id="payment-alerts-title" className="text-sm font-semibold text-slate-950">
              Alertas financeiros
            </h2>
            <p className="text-xs text-slate-500">Pagamentos pendentes ou atrasados.</p>
          </div>
        </div>

        <div className="flex gap-3 text-sm font-medium">
          <Link className="text-amber-700 hover:text-amber-800" to="/payments?status=Pending">
            Pendentes
          </Link>
          <Link className="text-red-700 hover:text-red-800" to="/payments?status=Overdue">
            Atrasados
          </Link>
        </div>
      </div>

      {isLoading ? <p className="px-5 py-6 text-sm text-slate-600">Carregando pagamentos...</p> : null}

      {isError ? (
        <p className="px-5 py-6 text-sm font-medium text-red-700">Não foi possível carregar os alertas financeiros.</p>
      ) : null}

      {!isLoading && !isError && alertPayments.length === 0 ? (
        <div className="px-5 py-6">
          <p className="text-sm text-slate-600">Nenhuma cobrança pendente ou atrasada.</p>
          <Link
            className="mt-3 inline-flex h-9 items-center rounded-md bg-emerald-700 px-3 text-sm font-medium text-white hover:bg-emerald-800"
            to="/payments/new"
          >
            Novo pagamento
          </Link>
        </div>
      ) : null}

      {!isLoading && !isError && alertPayments.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {alertPayments.map((payment) => (
            <li key={payment.id}>
              <Link
                className="block px-5 py-4 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                to={`/payments/${payment.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-950">
                      {studentNames.get(payment.studentId) ?? 'Aluno removido'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatCurrency(payment.amount, payment.currency)} vencendo em {formatDateTime(payment.dueDateUtc)}
                    </p>
                  </div>
                  <Badge tone={statusTones[payment.status]}>{statusLabels[payment.status]}</Badge>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
