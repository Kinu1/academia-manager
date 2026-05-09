import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { getApiFieldErrors, toApiError } from '../../../shared/api/api-error'
import { toDateTimeInputValue, toUtcIsoString } from '../../../shared/lib/formatters'
import { canManageTrainings } from '../../../shared/lib/permissions'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useStudents } from '../../students/hooks/use-students'
import { TrainingForm } from '../components/training-form'
import { useCreateTraining, useTraining, useUpdateTraining } from '../hooks/use-trainings'
import type { TrainingFormValues } from '../schemas/training-schemas'

export function TrainingFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const trainingQuery = useTraining(id)
  const createTraining = useCreateTraining()
  const updateTraining = useUpdateTraining(id ?? '')
  const { showToast } = useToast()

  if (!canManageTrainings(user?.role)) {
    return <Navigate to="/trainings" replace />
  }

  const mutation = isEditing ? updateTraining : createTraining
  const apiError = mutation.error ? toApiError(mutation.error) : null
  const error = apiError?.message ?? null
  const fieldErrors = getApiFieldErrors(apiError, ['studentId', 'title', 'description', 'scheduledForUtc'])

  async function handleSubmit(values: TrainingFormValues) {
    const scheduledForUtc = toUtcIsoString(values.scheduledForUtc)

    try {
      if (isEditing && id) {
        await updateTraining.mutateAsync({
          title: values.title,
          description: values.description,
          scheduledForUtc,
        })
        showToast({ title: 'Treino atualizado.', tone: 'success' })
      } else {
        await createTraining.mutateAsync({
          studentId: values.studentId,
          title: values.title,
          description: values.description,
          scheduledForUtc,
        })
        showToast({ title: 'Treino criado.', tone: 'success' })
      }

      navigate('/trainings')
    } catch (error) {
      showToast({ title: 'Nao foi possivel salvar o treino.', description: toApiError(error).message, tone: 'danger' })
    }
  }

  const isLoading = studentsQuery.isLoading || (isEditing && trainingQuery.isLoading)
  const isError = studentsQuery.isError || (isEditing && trainingQuery.isError)

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        to="/trainings"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950">{isEditing ? 'Editar treino' : 'Novo treino'}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing ? 'Atualize titulo, descricao e horario.' : 'Agende um treino para um aluno.'}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando formulario...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 text-sm font-medium text-red-700 shadow-sm">
          Nao foi possivel carregar os dados do treino.
        </div>
      ) : null}

      {studentsQuery.data && (!isEditing || trainingQuery.data) ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <TrainingForm
            students={studentsQuery.data.data}
            isEditing={isEditing}
            isSubmitting={mutation.isPending}
            error={error}
            fieldErrors={fieldErrors}
            defaultValues={
              trainingQuery.data
                ? {
                    studentId: trainingQuery.data.studentId,
                    title: trainingQuery.data.title,
                    description: trainingQuery.data.description,
                    scheduledForUtc: toDateTimeInputValue(trainingQuery.data.scheduledForUtc),
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
