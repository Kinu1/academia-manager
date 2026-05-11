import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { getApiFieldErrors, toApiError } from '../../../shared/api/api-error'
import { canManageStudents } from '../../../shared/lib/permissions'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { usePlans } from '../../plans/hooks/use-plans'
import { StudentForm } from '../components/student-form'
import { useCreateStudent, useStudent, useUpdateStudent } from '../hooks/use-students'
import type { StudentFormValues } from '../schemas/student-schemas'

export function StudentFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const plansQuery = usePlans({ page: 1, perPage: 100 })
  const studentQuery = useStudent(id)
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent(id ?? '')
  const { showToast } = useToast()

  if (!canManageStudents(user?.role)) {
    return <Navigate to="/students" replace />
  }

  const mutation = isEditing ? updateStudent : createStudent
  const apiError = mutation.error ? toApiError(mutation.error) : null
  const error = apiError?.message ?? null
  const fieldErrors = getApiFieldErrors(apiError, ['name', 'email', 'phone', 'planId', 'status'])

  async function handleSubmit(values: StudentFormValues) {
    try {
      if (isEditing && id) {
        await updateStudent.mutateAsync(values)
        showToast({ title: 'Aluno atualizado.', tone: 'success' })
      } else {
        await createStudent.mutateAsync({
          name: values.name,
          email: values.email,
          phone: values.phone,
          planId: values.planId,
        })
        showToast({ title: 'Aluno criado.', tone: 'success' })
      }

      navigate(isEditing && id ? `/students/${id}` : '/students')
    } catch (error) {
      showToast({ title: 'Não foi possível salvar o aluno.', description: toApiError(error).message, tone: 'danger' })
    }
  }

  const isLoading = plansQuery.isLoading || (isEditing && studentQuery.isLoading)
  const isError = plansQuery.isError || (isEditing && studentQuery.isError)

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        to={isEditing && id ? `/students/${id}` : '/students'}
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950">{isEditing ? 'Editar aluno' : 'Novo aluno'}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing ? 'Atualize cadastro, plano e status.' : 'Cadastre um aluno e vincule um plano.'}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando formulário...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 text-sm font-medium text-red-700 shadow-sm">
          Não foi possível carregar os dados do aluno.
        </div>
      ) : null}

      {plansQuery.data && (!isEditing || studentQuery.data) ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <StudentForm
            plans={plansQuery.data.data}
            isEditing={isEditing}
            isSubmitting={mutation.isPending}
            error={error}
            fieldErrors={fieldErrors}
            defaultValues={
              studentQuery.data
                ? {
                    name: studentQuery.data.name,
                    email: studentQuery.data.email,
                    phone: studentQuery.data.phone ?? '',
                    planId: studentQuery.data.planId ?? '',
                    status: studentQuery.data.status,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
          />
        </section>
      ) : null}
    </div>
  )
}
