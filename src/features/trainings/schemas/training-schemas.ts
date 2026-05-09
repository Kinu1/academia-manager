import { z } from 'zod'

export const trainingFormSchema = z.object({
  studentId: z.string().uuid('Selecione um aluno.'),
  title: z.string().min(2, 'Informe o titulo do treino.'),
  description: z.string().min(3, 'Informe a descricao do treino.'),
  scheduledForUtc: z.string().min(1, 'Informe a data e horario.'),
})

export type TrainingFormValues = z.infer<typeof trainingFormSchema>
