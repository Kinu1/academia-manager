import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../shared/ui/button'
import { Field } from '../../../shared/ui/field'
import { SelectField } from '../../../shared/ui/select-field'
import type { StudentResponse } from '../../students/types'
import { paymentFormSchema, type PaymentFormInput, type PaymentFormValues } from '../schemas/payment-schemas'

type PaymentFormProps = {
  students: StudentResponse[]
  defaultValues?: Partial<PaymentFormValues>
  isEditing?: boolean
  isSubmitting: boolean
  error?: string | null
  fieldErrors?: Partial<Record<keyof PaymentFormInput, string>>
  onSubmit: (values: PaymentFormValues) => void
}

const initialValues: PaymentFormInput = {
  studentId: '',
  amount: 0,
  dueDateUtc: '',
  status: 'Pending',
}

export function PaymentForm({
  students,
  defaultValues,
  isEditing = false,
  isSubmitting,
  error,
  fieldErrors,
  onSubmit,
}: PaymentFormProps) {
  const form = useForm<PaymentFormInput, unknown, PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { ...initialValues, ...defaultValues },
  })

  useEffect(() => {
    form.reset({ ...initialValues, ...defaultValues })
  }, [defaultValues, form])

  return (
    <form className="max-w-xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <SelectField
        label="Aluno"
        error={form.formState.errors.studentId?.message ?? fieldErrors?.studentId}
        selectProps={{ disabled: isEditing, ...form.register('studentId') }}
      >
        <option value="">Selecione um aluno.</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </SelectField>
      <Field
        label="Valor"
        error={form.formState.errors.amount?.message ?? fieldErrors?.amount}
        inputProps={{ type: 'number', min: 0, step: '0.01', ...form.register('amount') }}
      />
      <Field
        label="Vencimento"
        error={form.formState.errors.dueDateUtc?.message ?? fieldErrors?.dueDateUtc}
        inputProps={{ type: 'datetime-local', ...form.register('dueDateUtc') }}
      />
      {isEditing ? (
        <SelectField
          label="Status"
          error={form.formState.errors.status?.message ?? fieldErrors?.status}
          selectProps={form.register('status')}
        >
          <option value="Pending">Pendente</option>
          <option value="Paid">Pago</option>
          <option value="Overdue">Atrasado</option>
          <option value="Canceled">Cancelado</option>
        </SelectField>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar pagamento'}</Button>
    </form>
  )
}
