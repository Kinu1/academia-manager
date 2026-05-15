import { Download, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { downloadCsv, toCsv } from '../../../shared/lib/csv'
import { formatCurrency } from '../../../shared/lib/formatters'
import { canManagePlans } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useChooseCurrentStudentPlan, useCurrentStudent } from '../../students/hooks/use-students'
import { useDeletePlan, usePlans } from '../hooks/use-plans'
import { PlansTable } from '../components/plans-table'
import { filterPlans, sortPlans, type PlanFilters, type PlanSortField, type PlanStatusFilter } from '../lib/plan-filters'
import { getPlanFiltersFromSearchParams, toPlanSearchParams } from '../lib/plan-url-filters'

export function PlansPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = getPlanFiltersFromSearchParams(searchParams)
  const { user } = useAuth()
  const canManage = canManagePlans(user?.role)
  const isStudent = user?.role === 'Student'
  const plansQuery = usePlans({ page: filters.page, perPage: filters.perPage })
  const currentStudentQuery = useCurrentStudent({ enabled: isStudent })
  const choosePlan = useChooseCurrentStudentPlan()
  const deletePlan = useDeletePlan()
  const [deletingId, setDeletingId] = useState<string>()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deletePlan.mutateAsync(id)
      showToast({ title: 'Plano excluído.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Não foi possível excluir o plano.', description: toApiError(error).message, tone: 'danger' })
    } finally {
      setDeletingId(undefined)
      setConfirmDeleteId(undefined)
    }
  }

  async function handleChoosePlan(id: string) {
    try {
      await choosePlan.mutateAsync(id)
      showToast({ title: 'Plano selecionado.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Não foi possível selecionar o plano.', description: toApiError(error).message, tone: 'danger' })
    }
  }

  const filteredPlans = plansQuery.data ? sortPlans(filterPlans(plansQuery.data.data, filters), filters) : []

  function updateFilters(nextFilters: PlanFilters) {
    setSearchParams(toPlanSearchParams({ ...filters, ...nextFilters, page: 1 }), { replace: true })
  }

  function updatePagination(nextPagination: { page?: number; perPage?: number }) {
    setSearchParams(toPlanSearchParams({ ...filters, ...nextPagination }), { replace: true })
  }

  function handleExportCsv() {
    const csv = toCsv(
      [
        { header: 'Nome', value: (plan) => plan.name },
        { header: 'Valor', value: (plan) => formatCurrency(plan.priceAmount, plan.priceCurrency) },
        { header: 'Duração', value: (plan) => `${plan.durationInDays} dias` },
        { header: 'Status', value: (plan) => (plan.isActive ? 'Ativo' : 'Inativo') },
      ],
      filteredPlans,
    )

    downloadCsv('planos.csv', csv)
    showToast({ title: 'CSV de planos exportado.', tone: 'success' })
  }

  const hasActiveFilters = filters.search.trim().length > 0 || filters.status !== 'All'

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Planos</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie valores, duração e disponibilidade.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="gap-2 bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={handleExportCsv}
            disabled={filteredPlans.length === 0}
          >
            <Download size={17} />
            Exportar CSV
          </Button>

          {canManage ? (
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
              to="/plans/new"
            >
              <Plus size={17} />
              Novo plano
            </Link>
          ) : null}
        </div>
      </div>

      {plansQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando planos...
        </div>
      ) : null}

      {plansQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Não foi possível carregar os planos.</p>
          <Button className="mt-4 gap-2" onClick={() => plansQuery.refetch()} type="button">
            <RefreshCw size={16} />
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {plansQuery.data && plansQuery.data.total === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Nenhum plano cadastrado.
        </div>
      ) : null}

      {plansQuery.data && plansQuery.data.total > 0 ? (
        <>
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_160px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar plano</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.search}
                onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
                placeholder="Nome do plano"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Status</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.status}
                onChange={(event) => updateFilters({ ...filters, status: event.target.value as PlanStatusFilter })}
              >
                <option value="All">Todos</option>
                <option value="Active">Ativos</option>
                <option value="Inactive">Inativos</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Ordenar por</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.sort}
                onChange={(event) => updateFilters({ ...filters, sort: event.target.value as PlanSortField })}
              >
                <option value="name">Nome</option>
                <option value="priceAmount">Valor</option>
                <option value="durationInDays">Duração</option>
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

          {filteredPlans.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Nenhum plano encontrado para os filtros atuais.
            </div>
          ) : null}

          {filteredPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <PlansTable
                plans={filteredPlans}
                canManage={canManage}
                currentPlanId={currentStudentQuery.data?.planId}
                choosingPlanId={choosePlan.isPending ? choosePlan.variables : undefined}
                onChoose={isStudent ? handleChoosePlan : undefined}
                deletingId={deletingId}
                onDelete={setConfirmDeleteId}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Página {plansQuery.data.page} de {plansQuery.data.totalPages || 1}
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
                disabled={filters.page >= plansQuery.data.totalPages}
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
        title="Excluir plano"
        description="Esta ação remove o plano selecionado. Alunos vinculados podem ficar sem plano."
        confirmLabel="Excluir plano"
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
