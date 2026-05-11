import { Download, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { downloadCsv, toCsv } from '../../../shared/lib/csv'
import { formatDateTime } from '../../../shared/lib/formatters'
import { canManageTrainings } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useStudents } from '../../students/hooks/use-students'
import { TrainingsTable } from '../components/trainings-table'
import { useDeleteTraining, useTrainings } from '../hooks/use-trainings'
import { filterTrainings, sortTrainings, type TrainingFilters, type TrainingSortField } from '../lib/training-filters'
import { getTrainingFiltersFromSearchParams, toTrainingSearchParams } from '../lib/training-url-filters'

export function TrainingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = getTrainingFiltersFromSearchParams(searchParams)
  const { user } = useAuth()
  const canManage = canManageTrainings(user?.role)
  const trainingsQuery = useTrainings({ page: filters.page, perPage: filters.perPage })
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const deleteTraining = useDeleteTraining()
  const [deletingId, setDeletingId] = useState<string>()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteTraining.mutateAsync(id)
      showToast({ title: 'Treino excluído.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Não foi possível excluir o treino.', description: toApiError(error).message, tone: 'danger' })
    } finally {
      setDeletingId(undefined)
      setConfirmDeleteId(undefined)
    }
  }

  const hasError = trainingsQuery.isError || studentsQuery.isError
  const filteredTrainings =
    trainingsQuery.data && studentsQuery.data
      ? sortTrainings(filterTrainings(trainingsQuery.data.data, studentsQuery.data.data, filters), studentsQuery.data.data, filters)
      : []

  function updateFilters(nextFilters: TrainingFilters) {
    setSearchParams(toTrainingSearchParams({ ...filters, ...nextFilters, page: 1 }), { replace: true })
  }

  function updatePagination(nextPagination: { page?: number; perPage?: number }) {
    setSearchParams(toTrainingSearchParams({ ...filters, ...nextPagination }), { replace: true })
  }

  function handleExportCsv() {
    const studentNames = new Map((studentsQuery.data?.data ?? []).map((student) => [student.id, student.name]))
    const csv = toCsv(
      [
        { header: 'Título', value: (training) => training.title },
        { header: 'Aluno', value: (training) => studentNames.get(training.studentId) ?? 'Aluno removido' },
        { header: 'Descrição', value: (training) => training.description },
        { header: 'Agendado', value: (training) => formatDateTime(training.scheduledForUtc) },
      ],
      filteredTrainings,
    )

    downloadCsv('treinos.csv', csv)
    showToast({ title: 'CSV de treinos exportado.', tone: 'success' })
  }

  const hasActiveFilters = filters.search.trim().length > 0 || filters.scheduledDate.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Treinos</h1>
          <p className="mt-1 text-sm text-slate-600">Agende e atualize treinos por aluno.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="gap-2 bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={handleExportCsv}
            disabled={filteredTrainings.length === 0}
          >
            <Download size={17} />
            Exportar CSV
          </Button>

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
      </div>

      {trainingsQuery.isLoading || studentsQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando treinos...
        </div>
      ) : null}

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Não foi possível carregar os treinos.</p>
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
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_160px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar treino</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.search}
                onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
                placeholder="Título, descrição ou aluno"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Data</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.scheduledDate}
                onChange={(event) => updateFilters({ ...filters, scheduledDate: event.target.value })}
                type="date"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Ordenar por</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.sort}
                onChange={(event) => updateFilters({ ...filters, sort: event.target.value as TrainingSortField })}
              >
                <option value="scheduledForUtc">Data</option>
                <option value="title">Título</option>
                <option value="student">Aluno</option>
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
                onDelete={setConfirmDeleteId}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Página {trainingsQuery.data.page} de {trainingsQuery.data.totalPages || 1}
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
                disabled={filters.page >= trainingsQuery.data.totalPages}
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
        title="Excluir treino"
        description="Esta ação remove o treino agendado selecionado."
        confirmLabel="Excluir treino"
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
