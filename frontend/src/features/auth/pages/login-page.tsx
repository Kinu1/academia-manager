import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../../shared/ui/button'
import { Field } from '../../../shared/ui/field'
import { toApiError } from '../../../shared/api/api-error'
import { useAppDispatch } from '../../../shared/hooks/redux'
import { login } from '../api/auth-api'
import { sessionReceived } from '../model/auth-slice'
import { loginSchema, type LoginFormValues } from '../schemas/auth-schemas'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      dispatch(sessionReceived(session))
      navigate('/')
    },
  })

  const error = mutation.error ? toApiError(mutation.error).message : null
  const emailField = form.register('email')
  const passwordField = form.register('password')

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-emerald-700">Academia Manager</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Entrar</h1>
        </div>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            mutation.reset()
            mutation.mutate(values)
          })}
        >
          <Field
            label="E-mail"
            error={form.formState.errors.email?.message}
            inputProps={{
              type: 'email',
              autoComplete: 'email',
              ...emailField,
              onChange: (event) => {
                mutation.reset()
                emailField.onChange(event)
              },
            }}
          />
          <Field
            label="Senha"
            error={form.formState.errors.password?.message}
            inputProps={{
              type: 'password',
              autoComplete: 'current-password',
              ...passwordField,
              onChange: (event) => {
                mutation.reset()
                passwordField.onChange(event)
              },
            }}
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Sem conta?{' '}
          <Link className="font-medium text-emerald-700 hover:text-emerald-800" to="/register">
            Criar acesso
          </Link>
        </p>
      </section>
    </main>
  )
}
