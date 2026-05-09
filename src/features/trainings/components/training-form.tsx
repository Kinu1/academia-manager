import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../shared/ui/button'
import { Field } from '../../../shared/ui/field'
import { SelectField } from '../../../shared/ui/select-field'
import type { StudentResponse } from '../../students/types'
import { trainingFormSchema, type TrainingFormValues } from '../schemas/training-schemas'

type TrainingFormProps = {
  students: StudentResponse[]
  defaultValues?: Partial<TrainingFormValues>
  isEditing?: boolean
  isSubmitting: boolean
  error?: string | null
  fieldErrors?: Partial<Record<keyof TrainingFormValues, string>>
  onSubmit: (values: TrainingFormValues) => void
}

const initialValues: TrainingFormValues = {
  studentId: '',
  title: '',
  description: '',
  scheduledForUtc: '',
}

export function TrainingForm({
  students,
  defaultValues,
  isEditing = false,
  isSubmitting,
  error,
  fieldErrors,
  onSubmit,
}: TrainingFormProps) {
  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingFormSchema),
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
        <option value="">Selecione um aluno</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </SelectField>
      <Field
        label="Titulo"
        error={form.formState.errors.title?.message ?? fieldErrors?.title}
        inputProps={form.register('title')}
      />
      <Field
        label="Descricao"
        error={form.formState.errors.description?.message ?? fieldErrors?.description}
        inputProps={form.register('description')}
      />
      <Field
        label="Data e horario"
        error={form.formState.errors.scheduledForUtc?.message ?? fieldErrors?.scheduledForUtc}
        inputProps={{ type: 'datetime-local', ...form.register('scheduledForUtc') }}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar treino'}</Button>
    </form>
  )
}
