import { Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatCurrency, formatDateTime } from '../../../shared/lib/formatters'
import { Badge } from '../../../shared/ui/badge'
import type { StudentResponse } from '../../students/types'
import type { PaymentResponse, PaymentStatus } from '../types'

type PaymentsTableProps = {
  payments: PaymentResponse[]
  students: StudentResponse[]
  canManage: boolean
  deletingId?: string
  onDelete: (id: string) => void
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

export function PaymentsTable({ payments, students, canManage, deletingId, onDelete }: PaymentsTableProps) {
  const studentNames = new Map(students.map((student) => [student.id, student.name]))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Aluno</th>
            <th className="px-4 py-3 font-semibold">Valor</th>
            <th className="px-4 py-3 font-semibold">Vencimento</th>
            <th className="px-4 py-3 font-semibold">Pagamento</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <tr key={payment.id} className="text-slate-700">
              <td className="px-4 py-3 font-medium text-slate-950">
                {studentNames.get(payment.studentId) ?? 'Aluno removido'}
              </td>
              <td className="px-4 py-3">{formatCurrency(payment.amount, payment.currency)}</td>
              <td className="px-4 py-3">{formatDateTime(payment.dueDateUtc)}</td>
              <td className="px-4 py-3">{payment.paidAtUtc ? formatDateTime(payment.paidAtUtc) : '-'}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTones[payment.status]}>{statusLabels[payment.status]}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {canManage ? (
                    <>
                      <Link
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                        to={`/payments/${payment.id}`}
                        aria-label={`Editar pagamento de ${studentNames.get(payment.studentId) ?? 'aluno removido'}`}
                      >
                        <Edit size={17} />
                      </Link>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-slate-100 hover:text-red-600 focus-visible:text-red-600 disabled:opacity-50"
                        onClick={() => onDelete(payment.id)}
                        type="button"
                        disabled={deletingId === payment.id}
                        aria-label={`Excluir pagamento de ${studentNames.get(payment.studentId) ?? 'aluno removido'}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
