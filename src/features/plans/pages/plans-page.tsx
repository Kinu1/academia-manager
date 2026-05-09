import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { canManagePlans } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useDeletePlan, usePlans } from '../hooks/use-plans'
import { PlansTable } from '../components/plans-table'
import { filterPlans, type PlanStatusFilter } from '../lib/plan-filters'

const perPage = 10

export function PlansPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>('All')
  const { user } = useAuth()
  const canManage = canManagePlans(user?.role)
  const plansQuery = usePlans({ page, perPage })
  const deletePlan = useDeletePlan()
  const [deletingId, setDeletingId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Excluir este plano?')

    if (!confirmed) {
      return
    }

    setDeletingId(id)
    try {
      await deletePlan.mutateAsync(id)
      showToast({ title: 'Plano excluido.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Nao foi possivel excluir o plano.', description: toApiError(error).message, tone: 'danger' })
    } finally {
      setDeletingId(undefined)
    }
  }

  const filteredPlans = plansQuery.data ? filterPlans(plansQuery.data.data, { search, status: statusFilter }) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Planos</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie valores, duracao e disponibilidade.</p>
        </div>

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

      {plansQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando planos...
        </div>
      ) : null}

      {plansQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Nao foi possivel carregar os planos.</p>
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
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar plano</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome do plano"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Status</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as PlanStatusFilter)}
              >
                <option value="All">Todos</option>
                <option value="Active">Ativos</option>
                <option value="Inactive">Inativos</option>
              </select>
            </label>
          </section>

          {filteredPlans.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Nenhum plano encontrado para os filtros atuais.
            </div>
          ) : null}

          {filteredPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <PlansTable plans={filteredPlans} canManage={canManage} deletingId={deletingId} onDelete={handleDelete} />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Pagina {plansQuery.data.page} de {plansQuery.data.totalPages || 1}
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
                disabled={page >= plansQuery.data.totalPages}
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
