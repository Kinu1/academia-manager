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
  emerald: 'bg-green-50 text-green-700 ring-green-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  blue: 'bg-slate-100 text-slate-700 ring-slate-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export function StatCard({ icon: Icon, label, value, description, tone = 'emerald', to, trend }: StatCardProps) {
  const content = (
    <div
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
      aria-label={`${label}: ${String(value)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl ring-1', toneClasses[tone])}>
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        {description ? <p className="text-xs leading-5 text-slate-500">{description}</p> : <span />}
        {trend ? <div className="shrink-0 text-xs font-medium text-slate-600">{trend}</div> : null}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link className="block focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2" to={to}>
        {content}
      </Link>
    )
  }

  return content
}
