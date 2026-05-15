import type { LucideIcon } from 'lucide-react'

import { formatDateTime } from '../lib/formatters'
import { cn } from '../utils/cn'

export type TimelineItem = {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: LucideIcon
  tone?: 'emerald' | 'amber' | 'red' | 'neutral'
}

type TimelineProps = {
  items: TimelineItem[]
  emptyMessage?: string
}

const toneClasses = {
  emerald: 'bg-green-50 text-green-700 ring-green-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export function Timeline({ items, emptyMessage = 'Nenhum evento registrado.' }: TimelineProps) {
  if (items.length === 0) {
    return <p className="px-5 py-6 text-sm text-slate-600">{emptyMessage}</p>
  }

  return (
    <ol className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon
        const tone = item.tone ?? 'neutral'

        return (
          <li key={item.id} className="relative pl-11">
            <span
              className={cn(
                'absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-2xl ring-1',
                toneClasses[tone],
              )}
            >
              {Icon ? <Icon size={15} aria-hidden="true" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <time className="text-xs text-slate-500" dateTime={item.timestamp}>
                  {formatDateTime(item.timestamp)}
                </time>
              </div>
              {item.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
