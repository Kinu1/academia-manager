import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-600/70 bg-slate-950/42 px-5 py-8 text-center shadow-inner">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-slate-50">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}
