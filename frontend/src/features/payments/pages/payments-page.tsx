import { Download, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { downloadCsv, toCsv } from '../../../shared/lib/csv'
import { formatCurrency, formatDateTime } from '../../../shared/lib/formatters'
import { canManagePayments } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useStudents } from '../../students/hooks/use-students'
import { PaymentsTable } from '../components/payments-table'
import { useDeletePayment, usePayments } from '../hooks/use-payments'
import {
  filterPayments,
  sortPayments,
  type PaymentFilters,
  type PaymentSortField,
  type PaymentStatusFilter,
} from '../lib/payment-filters'
import { getPaymentFiltersFromSearchParams, toPaymentSearchParams } from '../lib/payment-url-filters'
import type { PaymentStatus } from '../types'

const paymentStatusLabels: Record<PaymentStatus, string> = {
  Pending: 'Pendente',
  Paid: 'Pago',
  Overdue: 'Atrasado',
  Canceled: 'Cancelado',
}

export function PaymentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = getPaymentFiltersFromSearchParams(searchParams)
  const { user } = useAuth()
  const canManage = canManagePayments(user?.role)
  const paymentsQuery = usePayments({ page: filters.page, perPage: filters.perPage })
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const deletePayment = useDeletePayment()
  const [deletingId, setDeletingId] = useState<string>()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deletePayment.mutateAsync(id)
      showToast({ title: 'Pagamento excluído.', tone: 'success' })
    } catch (error) {
      showToast({
        title: 'Não foi possível excluir o pagamento.',
        description: toApiError(error).message,
        tone: 'danger',
      })
    } finally {
      setDeletingId(undefined)
      setConfirmDeleteId(undefined)
    }
  }

  const hasError = paymentsQuery.isError || studentsQuery.isError
  const filteredPayments =
    paymentsQuery.data && studentsQuery.data
      ? sortPayments(filterPayments(paymentsQuery.data.data, studentsQuery.data.data, filters), studentsQuery.data.data, filters)
      : []

  function updateFilters(nextFilters: PaymentFilters) {
    setSearchParams(toPaymentSearchParams({ ...filters, ...nextFilters, page: 1 }), { replace: true })
  }

  function updatePagination(nextPagination: { page?: number; perPage?: number }) {
    setSearchParams(toPaymentSearchParams({ ...filters, ...nextPagination }), { replace: true })
  }

  function handleExportCsv() {
    const studentNames = new Map((studentsQuery.data?.data ?? []).map((student) => [student.id, student.name]))
    const csv = toCsv(
      [
        { header: 'Aluno', value: (payment) => studentNames.get(payment.studentId) ?? 'Aluno removido' },
        { header: 'Valor', value: (payment) => formatCurrency(payment.amount, payment.currency) },
        { header: 'Vencimento', value: (payment) => formatDateTime(payment.dueDateUtc) },
        { header: 'Pagamento', value: (payment) => (payment.paidAtUtc ? formatDateTime(payment.paidAtUtc) : '') },
        { header: 'Status', value: (payment) => paymentStatusLabels[payment.status] },
      ],
      filteredPayments,
    )

    downloadCsv('pagamentos.csv', csv)
    showToast({ title: 'CSV de pagamentos exportado.', tone: 'success' })
  }

  const hasActiveFilters = filters.search.trim().length > 0 || filters.status !== 'All'

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Pagamentos</h1>
          <p className="mt-1 text-sm text-slate-600">Acompanhe cobranças, vencimentos e status financeiro.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="gap-2 bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={handleExportCsv}
            disabled={filteredPayments.length === 0}
          >
            <Download size={17} />
            Exportar CSV
          </Button>

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
      </div>

      {paymentsQuery.isLoading || studentsQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando pagamentos...
        </div>
      ) : null}

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Não foi possível carregar os pagamentos.</p>
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
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_160px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar pagamento</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.search}
                onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
                placeholder="Nome ou e-mail do aluno"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Status</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.status}
                onChange={(event) => updateFilters({ ...filters, status: event.target.value as PaymentStatusFilter })}
              >
                <option value="All">Todos</option>
                <option value="Pending">Pendentes</option>
                <option value="Paid">Pagos</option>
                <option value="Overdue">Atrasados</option>
                <option value="Canceled">Cancelados</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Ordenar por</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.sort}
                onChange={(event) => updateFilters({ ...filters, sort: event.target.value as PaymentSortField })}
              >
                <option value="dueDateUtc">Vencimento</option>
                <option value="student">Aluno</option>
                <option value="amount">Valor</option>
                <option value="status">Status</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Direção</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.sortDir}
                onChange={(event) => updateFilters({ ...filters, sortDir: event.target.value as 'asc' | 'desc' })}
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </label>

            {hasActiveFilters ? (
              <div className="md:col-span-4">
                <Button
                  type="button"
                  className="bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  onClick={() => setSearchParams({}, { replace: true })}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : null}
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
                onDelete={setConfirmDeleteId}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Página {paymentsQuery.data.page} de {paymentsQuery.data.totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <span>Por página</span>
                <select
                  className="h-10 rounded-md border border-slate-300 bg-white px-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  value={filters.perPage}
                  onChange={(event) => updatePagination({ page: 1, perPage: Number(event.target.value) })}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <Button
                type="button"
                className="bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                disabled={filters.page <= 1}
                onClick={() => updatePagination({ page: Math.max(1, filters.page - 1) })}
              >
                Anterior
              </Button>
              <Button
                type="button"
                className="bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                disabled={filters.page >= paymentsQuery.data.totalPages}
                onClick={() => updatePagination({ page: filters.page + 1 })}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      ) : null}

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Excluir pagamento"
        description="Esta ação remove o pagamento selecionado do histórico financeiro."
        confirmLabel="Excluir pagamento"
        isConfirming={Boolean(deletingId)}
        onCancel={() => setConfirmDeleteId(undefined)}
        onConfirm={() => {
          if (confirmDeleteId) {
            void handleDelete(confirmDeleteId)
          }
        }}
      />
    </div>
  )
}
