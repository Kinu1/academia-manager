import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { getApiFieldErrors, toApiError } from '../../../shared/api/api-error'
import { canManagePlans } from '../../../shared/lib/permissions'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { PlanForm } from '../components/plan-form'
import { useCreatePlan, usePlan, useUpdatePlan } from '../hooks/use-plans'
import type { PlanFormValues } from '../schemas/plan-schemas'

export function PlanFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const planQuery = usePlan(id)
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan(id ?? '')
  const { showToast } = useToast()

  if (!canManagePlans(user?.role)) {
    return <Navigate to="/plans" replace />
  }

  const mutation = isEditing ? updatePlan : createPlan
  const apiError = mutation.error ? toApiError(mutation.error) : null
  const error = apiError?.message ?? null
  const fieldErrors = getApiFieldErrors(apiError, ['name', 'priceAmount', 'durationInDays', 'isActive'])

  async function handleSubmit(values: PlanFormValues) {
    try {
      if (isEditing && id) {
        await updatePlan.mutateAsync(values)
        showToast({ title: 'Plano atualizado.', tone: 'success' })
      } else {
        await createPlan.mutateAsync({
          name: values.name,
          priceAmount: values.priceAmount,
          durationInDays: values.durationInDays,
        })
        showToast({ title: 'Plano criado.', tone: 'success' })
      }

      navigate('/plans')
    } catch (error) {
      showToast({ title: 'Não foi possível salvar o plano.', description: toApiError(error).message, tone: 'danger' })
    }
  }

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950" to="/plans">
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950">{isEditing ? 'Editar plano' : 'Novo plano'}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing ? 'Atualize nome, valor, duração e status.' : 'Cadastre um plano para vincular alunos.'}
        </p>
      </div>

      {isEditing && planQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando plano...
        </div>
      ) : null}

      {isEditing && planQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 text-sm font-medium text-red-700 shadow-sm">
          Plano não encontrado ou indisponível.
        </div>
      ) : null}

      {!isEditing || planQuery.data ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <PlanForm
            isEditing={isEditing}
            isSubmitting={mutation.isPending}
            error={error}
            fieldErrors={fieldErrors}
            defaultValues={
              planQuery.data
                ? {
                    name: planQuery.data.name,
                    priceAmount: planQuery.data.priceAmount,
                    durationInDays: planQuery.data.durationInDays,
                    isActive: planQuery.data.isActive,
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
