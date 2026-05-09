import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../shared/ui/button'
import { Field } from '../../../shared/ui/field'
import { SelectField } from '../../../shared/ui/select-field'
import type { PlanResponse } from '../../plans/types'
import { studentFormSchema, type StudentFormInput, type StudentFormValues } from '../schemas/student-schemas'

type StudentFormProps = {
  plans: PlanResponse[]
  defaultValues?: Partial<StudentFormInput>
  isEditing?: boolean
  isSubmitting: boolean
  error?: string | null
  fieldErrors?: Partial<Record<keyof StudentFormInput, string>>
  onSubmit: (values: StudentFormValues) => void
}

const initialValues: StudentFormInput = {
  name: '',
  email: '',
  phone: '',
  planId: '',
  status: 'Active',
}

export function StudentForm({
  plans,
  defaultValues,
  isEditing = false,
  isSubmitting,
  error,
  fieldErrors,
  onSubmit,
}: StudentFormProps) {
  const form = useForm<StudentFormInput, unknown, StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: { ...initialValues, ...defaultValues },
  })

  useEffect(() => {
    form.reset({ ...initialValues, ...defaultValues })
  }, [defaultValues, form])

  return (
    <form className="max-w-xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Field
        label="Nome"
        error={form.formState.errors.name?.message ?? fieldErrors?.name}
        inputProps={form.register('name')}
      />
      <Field
        label="E-mail"
        error={form.formState.errors.email?.message ?? fieldErrors?.email}
        inputProps={{ type: 'email', ...form.register('email') }}
      />
      <Field
        label="Telefone"
        error={form.formState.errors.phone?.message ?? fieldErrors?.phone}
        inputProps={form.register('phone')}
      />
      <SelectField
        label="Plano"
        error={form.formState.errors.planId?.message ?? fieldErrors?.planId}
        selectProps={form.register('planId')}
      >
        <option value="">Sem plano</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </SelectField>
      {isEditing ? (
        <SelectField
          label="Status"
          error={form.formState.errors.status?.message ?? fieldErrors?.status}
          selectProps={form.register('status')}
        >
          <option value="Active">Ativo</option>
          <option value="Inactive">Inativo</option>
          <option value="Suspended">Suspenso</option>
        </SelectField>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar aluno'}</Button>
    </form>
  )
}
