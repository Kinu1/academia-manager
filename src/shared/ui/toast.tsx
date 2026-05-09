import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useCallback, useMemo, useReducer, type ReactNode } from 'react'

import { cn } from '../utils/cn'
import { ToastContext } from './toast-context'
import { toastReducer, type ToastInput, type ToastTone } from './toast-state'

const toneClasses: Record<ToastTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  danger: 'border-red-200 bg-red-50 text-red-950',
  info: 'border-slate-200 bg-white text-slate-950',
}

const toneIcons = {
  success: CheckCircle2,
  danger: XCircle,
  info: Info,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: 'remove', id })
  }, [])

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = crypto.randomUUID()
      dispatch({ type: 'add', toast: { id, ...toast } })
      window.setTimeout(() => dismissToast(id), 4500)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        role="status"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone]

          return (
            <article
              key={toast.id}
              className={cn('rounded-lg border p-4 shadow-lg', toneClasses[toast.tone])}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
                </div>
                <button
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  onClick={() => dismissToast(toast.id)}
                  type="button"
                  aria-label="Fechar aviso"
                >
                  <X size={16} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
