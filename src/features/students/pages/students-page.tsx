import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { toApiError } from '../../../shared/api/api-error'
import { canDeleteStudents, canManageStudents } from '../../../shared/lib/permissions'
import { Button } from '../../../shared/ui/button'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { usePlans } from '../../plans/hooks/use-plans'
import { StudentsTable } from '../components/students-table'
import { useDeleteStudent, useStudents } from '../hooks/use-students'
import { filterStudents, type StudentStatusFilter } from '../lib/student-filters'

const perPage = 10

export function StudentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>('All')
  const { user } = useAuth()
  const canManage = canManageStudents(user?.role)
  const canDelete = canDeleteStudents(user?.role)
  const studentsQuery = useStudents({ page, perPage })
  const plansQuery = usePlans({ page: 1, perPage: 100 })
  const deleteStudent = useDeleteStudent()
  const [deletingId, setDeletingId] = useState<string>()
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Excluir este aluno?')

    if (!confirmed) {
      return
    }

    setDeletingId(id)
    try {
      await deleteStudent.mutateAsync(id)
      showToast({ title: 'Aluno excluido.', tone: 'success' })
    } catch (error) {
      showToast({ title: 'Nao foi possivel excluir o aluno.', description: toApiError(error).message, tone: 'danger' })
    } finally {
      setDeletingId(undefined)
    }
  }

  const hasError = studentsQuery.isError || plansQuery.isError
  const filteredStudents = studentsQuery.data
    ? filterStudents(studentsQuery.data.data, { search, status: statusFilter })
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Alunos</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie cadastro, plano e situacao dos alunos.</p>
        </div>

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

      {studentsQuery.isLoading || plansQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando alunos...
        </div>
      ) : null}

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">Nao foi possivel carregar os alunos.</p>
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
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Buscar aluno</span>
              <input
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome ou e-mail"
                type="search"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-800">Status</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StudentStatusFilter)}
              >
                <option value="All">Todos</option>
                <option value="Active">Ativos</option>
                <option value="Inactive">Inativos</option>
                <option value="Suspended">Suspensos</option>
              </select>
            </label>
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
                canDelete={canDelete}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Pagina {studentsQuery.data.page} de {studentsQuery.data.totalPages || 1}
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
                disabled={page >= studentsQuery.data.totalPages}
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
