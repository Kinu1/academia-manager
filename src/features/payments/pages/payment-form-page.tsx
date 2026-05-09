import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { getApiFieldErrors, toApiError } from '../../../shared/api/api-error'
import { toDateTimeInputValue, toUtcIsoString } from '../../../shared/lib/formatters'
import { canManagePayments } from '../../../shared/lib/permissions'
import { useToast } from '../../../shared/ui/toast-context'
import { useAuth } from '../../auth/hooks/use-auth'
import { useStudents } from '../../students/hooks/use-students'
import { PaymentForm } from '../components/payment-form'
import { useCreatePayment, usePayment, useUpdatePayment } from '../hooks/use-payments'
import type { PaymentFormValues } from '../schemas/payment-schemas'

export function PaymentFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const studentsQuery = useStudents({ page: 1, perPage: 100 })
  const paymentQuery = usePayment(id)
  const createPayment = useCreatePayment()
  const updatePayment = useUpdatePayment(id ?? '')
  const { showToast } = useToast()

  if (!canManagePayments(user?.role)) {
    return <Navigate to="/payments" replace />
  }

  const mutation = isEditing ? updatePayment : createPayment
  const apiError = mutation.error ? toApiError(mutation.error) : null
  const error = apiError?.message ?? null
  const fieldErrors = getApiFieldErrors(apiError, ['studentId', 'amount', 'dueDateUtc', 'status'])

  async function handleSubmit(values: PaymentFormValues) {
    const dueDateUtc = toUtcIsoString(values.dueDateUtc)

    try {
      if (isEditing && id) {
        await updatePayment.mutateAsync({
          amount: values.amount,
          dueDateUtc,
          status: values.status,
        })
        showToast({ title: 'Pagamento atualizado.', tone: 'success' })
      } else {
        await createPayment.mutateAsync({
          studentId: values.studentId,
          amount: values.amount,
          dueDateUtc,
        })
        showToast({ title: 'Pagamento criado.', tone: 'success' })
      }

      navigate('/payments')
    } catch (error) {
      showToast({ title: 'Nao foi possivel salvar o pagamento.', description: toApiError(error).message, tone: 'danger' })
    }
  }

  const isLoading = studentsQuery.isLoading || (isEditing && paymentQuery.isLoading)
  const isError = studentsQuery.isError || (isEditing && paymentQuery.isError)

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        to="/payments"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {isEditing ? 'Editar pagamento' : 'Novo pagamento'}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing ? 'Atualize valor, vencimento e status.' : 'Registre uma cobranca para um aluno.'}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando formulario...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 text-sm font-medium text-red-700 shadow-sm">
          Nao foi possivel carregar os dados do pagamento.
        </div>
      ) : null}

      {studentsQuery.data && (!isEditing || paymentQuery.data) ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <PaymentForm
            students={studentsQuery.data.data}
            isEditing={isEditing}
            isSubmitting={mutation.isPending}
            error={error}
            fieldErrors={fieldErrors}
            defaultValues={
              paymentQuery.data
                ? {
                    studentId: paymentQuery.data.studentId,
                    amount: paymentQuery.data.amount,
                    dueDateUtc: toDateTimeInputValue(paymentQuery.data.dueDateUtc),
                    status: paymentQuery.data.status,
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
