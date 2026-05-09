import { z } from 'zod'

export const planFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome do plano.'),
  priceAmount: z.coerce.number().positive('O valor deve ser maior que zero.'),
  durationInDays: z.coerce
    .number()
    .int('A duracao deve ser um numero inteiro.')
    .min(1, 'A duracao deve ser de pelo menos 1 dia.'),
  isActive: z.coerce.boolean(),
})

export type PlanFormInput = z.input<typeof planFormSchema>
export type PlanFormValues = z.output<typeof planFormSchema>
