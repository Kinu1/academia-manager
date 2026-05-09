import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail valido.'),
  password: z.string().min(1, 'Informe a senha.').max(128, 'A senha deve ter no maximo 128 caracteres.'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Informe o nome.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  role: z.enum(['Trainer', 'Student']),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
