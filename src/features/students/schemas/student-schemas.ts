import { z } from 'zod'

const optionalText = z.preprocess((value) => (value === '' ? null : value), z.string().nullable())

export const studentFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome do aluno.'),
  email: z.string().email('Informe um e-mail valido.'),
  phone: optionalText,
  planId: optionalText,
  status: z.enum(['Active', 'Inactive', 'Suspended']),
})

export type StudentFormInput = z.input<typeof studentFormSchema>
export type StudentFormValues = z.output<typeof studentFormSchema>
