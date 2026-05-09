import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../shared/ui/button'
import { Field } from '../../../shared/ui/field'
import { SelectField } from '../../../shared/ui/select-field'
import { planFormSchema, type PlanFormInput, type PlanFormValues } from '../schemas/plan-schemas'

type PlanFormProps = {
  defaultValues?: Partial<PlanFormValues>
  isEditing?: boolean
  isSubmitting: boolean
  error?: string | null
  fieldErrors?: Partial<Record<keyof PlanFormValues, string>>
  onSubmit: (values: PlanFormValues) => void
}

const initialValues: PlanFormInput = {
  name: '',
  priceAmount: 0,
  durationInDays: 30,
  isActive: true,
}

export function PlanForm({
  defaultValues,
  isEditing = false,
  isSubmitting,
  error,
  fieldErrors,
  onSubmit,
}: PlanFormProps) {
  const form = useForm<PlanFormInput, unknown, PlanFormValues>({
    resolver: zodResolver(planFormSchema),
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
        label="Valor"
        error={form.formState.errors.priceAmount?.message ?? fieldErrors?.priceAmount}
        inputProps={{ type: 'number', min: 0, step: '0.01', ...form.register('priceAmount') }}
      />
      <Field
        label="Duracao em dias"
        error={form.formState.errors.durationInDays?.message ?? fieldErrors?.durationInDays}
        inputProps={{ type: 'number', min: 1, step: 1, ...form.register('durationInDays') }}
      />
      {isEditing ? (
        <SelectField
          label="Status"
          error={form.formState.errors.isActive?.message ?? fieldErrors?.isActive}
          selectProps={form.register('isActive')}
        >
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </SelectField>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar plano'}</Button>
    </form>
  )
}
