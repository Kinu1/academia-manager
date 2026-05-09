import type { ReactNode, SelectHTMLAttributes } from 'react'

type SelectFieldProps = {
  label: string
  error?: string
  children: ReactNode
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>
}

export function SelectField({ label, error, children, selectProps }: SelectFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        {...selectProps}
      >
        {children}
      </select>
      {error ? <span className="block text-sm text-red-600">{error}</span> : null}
    </label>
  )
}
