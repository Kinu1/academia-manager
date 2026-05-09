import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { canManageTrainings } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useStudents } from '../../students/hooks/use-students'
import { TrainingsTable } from '../components/trainings-table'
import { useDeleteTraining, useTrainings } from '../hooks/use-trainings'
import { filterTrainings } from '../lib/training-filters'

const perPage = 10

export function TrainingsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const { user } = useAuth()
  const canManage = canManageTrainings(user?.role)
  const trainingsQuery = useTrainings({ page, perPage })
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const deleteTraining = useDeleteTraining()
  const [deletingId, setDeletingId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Excluir este treino?')

    if (!confirmed) {
      return
    }

    setDeletingId(id)
    try {
      await deleteTraining.mutateAsync(id)
      showToast({ title: 'Treino excluido.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Nao foi possivel excluir o treino.', description: toApiError(error).message, tone: 'danger' })
    } finally {
      setDeletingId(undefined)
    }
  }

  const hasError = trainingsQuery.isError || studentsQuery.isError
  const filteredTrainings =
    trainingsQuery.data && studentsQuery.data
      ? filterTrainings(trainingsQuery.data.data, studentsQuery.data.data, { search, scheduledDate })
      : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Treinos</h1>
          <p className="mt-1 text-sm text-slate-600">Agende e atualize treinos por aluno.</p>
        </div>

        {canManage ? (
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
            to="/trainings/new"
          >
            <Plus size={17} />
            Novo treino
          </Link>
        ) : null}
      </div>

      {trainingsQuery.isLoading || studentsQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando treinos...
        </div>
      ) : null}

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Nao foi possivel carregar os treinos.</p>
          <Button
            className="mt-4 gap-2"
            onClick={() => {
              trainingsQuery.refetch()
              studentsQuery.refetch()
            }}
            type="button"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {trainingsQuery.data && trainingsQuery.data.total === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Nenhum treino cadastrado.
        </div>
      ) : null}

      {trainingsQuery.data && trainingsQuery.data.total > 0 && studentsQuery.data ? (
        <>
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar treino</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Titulo, descricao ou aluno"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Data</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={scheduledDate}
                onChange={(event) => setScheduledDate(event.target.value)}
                type="date"
              />
            </label>
          </section>

          {filteredTrainings.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Nenhum treino encontrado para os filtros atuais.
            </div>
          ) : null}

          {filteredTrainings.length > 0 ? (
            <div className="overflow-x-auto">
              <TrainingsTable
                trainings={filteredTrainings}
                students={studentsQuery.data.data}
                canManage={canManage}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Pagina {trainingsQuery.data.page} de {trainingsQuery.data.totalPages || 1}
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
                disabled={page >= trainingsQuery.data.totalPages}
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
