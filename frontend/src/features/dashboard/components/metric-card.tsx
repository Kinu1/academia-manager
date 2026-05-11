import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

type MetricCardProps = {
  icon: LucideIcon
  label: string
  value?: number
  isLoading: boolean
  to: string
}

export function MetricCard({ icon: Icon, label, value, isLoading, to }: MetricCardProps) {
  return (
    <Link
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      to={to}
      aria-label={`Abrir ${label}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-950">{isLoading ? '...' : value ?? 0}</p>
    </Link>
  )
}
