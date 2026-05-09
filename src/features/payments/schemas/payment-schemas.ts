import { z } from 'zod'

export const paymentStatuses = ['Pending', 'Paid', 'Overdue', 'Canceled'] as const

export const paymentFormSchema = z.object({
  studentId: z.string().uuid('Selecione um aluno.'),
  amount: z.coerce.number().positive('O valor deve ser maior que zero.'),
  dueDateUtc: z
    .string()
    .min(1, 'Informe a data de vencimento.')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Informe uma data valida.'),
  status: z.enum(paymentStatuses),
})

export type PaymentFormInput = z.input<typeof paymentFormSchema>
export type PaymentFormValues = z.output<typeof paymentFormSchema>
