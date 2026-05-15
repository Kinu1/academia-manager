import { Download, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { downloadCsv, toCsv } from '../../../shared/lib/csv'
import { canDeleteStudents, canManageStudents } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { usePlans } from '../../plans/hooks/use-plans'
import { StudentsTable } from '../components/students-table'
import { useDeleteStudent, useStudents } from '../hooks/use-students'
import {
  filterStudents,
  sortStudents,
  type StudentFilters,
  type StudentSortField,
  type StudentStatusFilter,
} from '../lib/student-filters'
import { getStudentFiltersFromSearchParams, toStudentSearchParams } from '../lib/student-url-filters'

export function StudentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = getStudentFiltersFromSearchParams(searchParams)
  const { user } = useAuth()
  const canManage = canManageStudents(user?.role)
  const canDelete = canDeleteStudents(user?.role)
  const studentsQuery = useStudents({ page: filters.page, perPage: filters.perPage }, { enabled: canManage })
  const plansQuery = usePlans({ page: 1, perPage: 100 }, { enabled: canManage })
  const deleteStudent = useDeleteStudent()
  const [deletingId, setDeletingId] = useState<string>()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>()
  const { showToast } = useToast()

  if (!canManage) {
    return <Navigate to="/plans" replace />
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteStudent.mutateAsync(id)
      showToast({ title: 'Aluno excluído.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Não foi possível excluir o aluno.', description: toApiError(error).message, tone: 'danger' })
    } finally {
      setDeletingId(undefined)
      setConfirmDeleteId(undefined)
    }
  }

  const hasError = studentsQuery.isError || plansQuery.isError
  const filteredStudents = studentsQuery.data ? sortStudents(filterStudents(studentsQuery.data.data, filters), filters) : []

  function updateFilters(nextFilters: StudentFilters) {
    setSearchParams(toStudentSearchParams({ ...filters, ...nextFilters, page: 1 }), { replace: true })
  }

  function updatePagination(nextPagination: { page?: number; perPage?: number }) {
    setSearchParams(toStudentSearchParams({ ...filters, ...nextPagination }), { replace: true })
  }

  function handleExportCsv() {
    const planNames = new Map((plansQuery.data?.data ?? []).map((plan) => [plan.id, plan.name]))
    const csv = toCsv(
      [
        { header: 'Nome', value: (student) => student.name },
        { header: 'E-mail', value: (student) => student.email },
        { header: 'Telefone', value: (student) => student.phone },
        {
          header: 'Plano',
          value: (student) => (student.planId ? planNames.get(student.planId) ?? 'Plano removido' : ''),
        },
        { header: 'Status', value: (student) => student.status },
      ],
      filteredStudents,
    )

    downloadCsv('alunos.csv', csv)
    showToast({ title: 'CSV de alunos exportado.', tone: 'success' })
  }

  const hasActiveFilters = filters.search.trim().length > 0 || filters.status !== 'All'

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Alunos</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie cadastro, plano e situação dos alunos.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="gap-2 bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={handleExportCsv}
            disabled={filteredStudents.length === 0}
          >
            <Download size={17} />
            Exportar CSV
          </Button>

          {canManage ? (
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
              to="/students/new"
            >
              <Plus size={17} />
              Novo aluno
            </Link>
          ) : null}
        </div>
      </div>

      {studentsQuery.isLoading || plansQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando alunos...
        </div>
      ) : null}

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Não foi possível carregar os alunos.</p>
          <Button
            className="mt-4 gap-2"
            onClick={() => {
              studentsQuery.refetch()
              plansQuery.refetch()
            }}
            type="button"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {studentsQuery.data && studentsQuery.data.total === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Nenhum aluno cadastrado.
        </div>
      ) : null}

      {studentsQuery.data && studentsQuery.data.total > 0 && plansQuery.data ? (
        <>
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_160px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar aluno</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.search}
                onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
                placeholder="Nome ou e-mail"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Status</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.status}
                onChange={(event) => updateFilters({ ...filters, status: event.target.value as StudentStatusFilter })}
              >
                <option value="All">Todos</option>
                <option value="Active">Ativos</option>
                <option value="Inactive">Inativos</option>
                <option value="Suspended">Suspensos</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Ordenar por</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={filters.sort}
                onChange={(event) => updateFilters({ ...filters, sort: event.target.value as StudentSortField })}
              >
                <option value="name">Nome</option>
                <option value="email">E-mail</option>
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

          {filteredStudents.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Nenhum aluno encontrado para os filtros atuais.
            </div>
          ) : null}

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <StudentsTable
                students={filteredStudents}
                plans={plansQuery.data.data}
                canManage={canManage}
                canDelete={canDelete}
                deletingId={deletingId}
                onDelete={setConfirmDeleteId}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Página {studentsQuery.data.page} de {studentsQuery.data.totalPages || 1}
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
                disabled={filters.page >= studentsQuery.data.totalPages}
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
        title="Excluir aluno"
        description="Esta ação remove o aluno selecionado e pode afetar treinos e pagamentos vinculados."
        confirmLabel="Excluir aluno"
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
