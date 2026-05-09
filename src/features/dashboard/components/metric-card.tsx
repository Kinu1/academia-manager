import type { LucideIcon } from 'lucide-react'

type MetricCardProps = {
  icon: LucideIcon
  label: string
  value?: number
  isLoading: boolean
}

export function MetricCard({ icon: Icon, label, value, isLoading }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-950">{isLoading ? '...' : value ?? 0}</p>
    </article>
  )
}
