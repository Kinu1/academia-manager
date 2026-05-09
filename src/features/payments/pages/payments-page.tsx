import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { canManagePayments } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useStudents } from '../../students/hooks/use-students'
import { PaymentsTable } from '../components/payments-table'
import { useDeletePayment, usePayments } from '../hooks/use-payments'
import { filterPayments, type PaymentStatusFilter } from '../lib/payment-filters'

const perPage = 10

export function PaymentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('All')
  const { user } = useAuth()
  const canManage = canManagePayments(user?.role)
  const paymentsQuery = usePayments({ page, perPage })
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const deletePayment = useDeletePayment()
  const [deletingId, setDeletingId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Excluir este pagamento?')

    if (!confirmed) {
      return
    }

    setDeletingId(id)
    try {
      await deletePayment.mutateAsync(id)
      showToast({ title: 'Pagamento excluido.', tone: 'success' })
    } catch (error) {
      showToast({
        title: 'Nao foi possivel excluir o pagamento.',
        description: toApiError(error).message,
        tone: 'danger',
      })
    } finally {
      setDeletingId(undefined)
    }
  }

  const hasError = paymentsQuery.isError || studentsQuery.isError
  const filteredPayments =
    paymentsQuery.data && studentsQuery.data
      ? filterPayments(paymentsQuery.data.data, studentsQuery.data.data, { search, status: statusFilter })
      : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Pagamentos</h1>
          <p className="mt-1 text-sm text-slate-600">Acompanhe cobrancas, vencimentos e status financeiro.</p>
        </div>

        {canManage ? (
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
            to="/payments/new"
          >
            <Plus size={17} />
            Novo pagamento
          </Link>
        ) : null}
      </div>

      {paymentsQuery.isLoading || studentsQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando pagamentos...
        </div>
      ) : null}

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Nao foi possivel carregar os pagamentos.</p>
          <Button
            className="mt-4 gap-2"
            onClick={() => {
              paymentsQuery.refetch()
              studentsQuery.refetch()
            }}
            type="button"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {paymentsQuery.data && paymentsQuery.data.total === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Nenhum pagamento cadastrado.
        </div>
      ) : null}

      {paymentsQuery.data && paymentsQuery.data.total > 0 && studentsQuery.data ? (
        <>
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar pagamento</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome ou e-mail do aluno"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Status</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as PaymentStatusFilter)}
              >
                <option value="All">Todos</option>
                <option value="Pending">Pendentes</option>
                <option value="Paid">Pagos</option>
                <option value="Overdue">Atrasados</option>
                <option value="Canceled">Cancelados</option>
              </select>
            </label>
          </section>

          {filteredPayments.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Nenhum pagamento encontrado para os filtros atuais.
            </div>
          ) : null}

          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <PaymentsTable
                payments={filteredPayments}
                students={studentsQuery.data.data}
                canManage={canManage}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Pagina {paymentsQuery.data.page} de {paymentsQuery.data.totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Anterior
              </Button>
              <Button
                type="button"
                className="bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                disabled={page >= paymentsQuery.data.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Proxima
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
