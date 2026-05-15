import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../utils/cn'

type StatTone = 'emerald' | 'amber' | 'red' | 'blue' | 'neutral'

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: ReactNode
  description?: string
  tone?: StatTone
  to?: string
  trend?: ReactNode
}

const toneClasses: Record<StatTone, string> = {
  emerald: 'from-emerald-400/18 text-emerald-200 ring-emerald-300/20',
  amber: 'from-amber-400/18 text-amber-200 ring-amber-300/20',
  red: 'from-red-400/18 text-red-200 ring-red-300/20',
  blue: 'from-sky-400/18 text-sky-200 ring-sky-300/20',
  neutral: 'from-slate-400/14 text-slate-200 ring-slate-300/20',
}

export function StatCard({ icon: Icon, label, value, description, tone = 'emerald', to, trend }: StatCardProps) {
  const content = (
    <div
      className="group rounded-2xl border border-white/10 bg-[linear-gradient(135deg,var(--tw-gradient-from),rgba(15,23,42,0.82)_46%,rgba(2,6,23,0.9))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.26)] transition hover:-translate-y-0.5 hover:border-white/20"
      aria-label={`${label}: ${String(value)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-50">{value}</p>
        </div>
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl ring-1', toneClasses[tone])}>
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        {description ? <p className="text-xs leading-5 text-slate-400">{description}</p> : <span />}
        {trend ? <div className="shrink-0 text-xs font-medium text-slate-300">{trend}</div> : null}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link className="block focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950" to={to}>
        {content}
      </Link>
    )
  }

  return content
}
