import { Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../../../shared/ui/badge'
import type { PlanResponse } from '../../plans/types'
import type { StudentResponse } from '../types'

type StudentsTableProps = {
  students: StudentResponse[]
  plans: PlanResponse[]
  canDelete: boolean
  deletingId?: string
  onDelete: (id: string) => void
}

const statusTone = {
  Active: 'success',
  Inactive: 'neutral',
  Suspended: 'warning',
} as const

export function StudentsTable({ students, plans, canDelete, deletingId, onDelete }: StudentsTableProps) {
  const planNames = new Map(plans.map((plan) => [plan.id, plan.name]))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Nome</th>
            <th className="px-4 py-3 font-semibold">E-mail</th>
            <th className="px-4 py-3 font-semibold">Telefone</th>
            <th className="px-4 py-3 font-semibold">Plano</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="text-slate-700">
              <td className="px-4 py-3 font-medium text-slate-950">{student.name}</td>
              <td className="px-4 py-3">{student.email}</td>
              <td className="px-4 py-3">{student.phone || '-'}</td>
              <td className="px-4 py-3">{student.planId ? planNames.get(student.planId) ?? 'Plano removido' : '-'}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone[student.status]}>{student.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                    to={`/students/${student.id}`}
                    aria-label={`Editar ${student.name}`}
                  >
                    <Edit size={17} />
                  </Link>
                  {canDelete ? (
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => onDelete(student.id)}
                      type="button"
                      disabled={deletingId === student.id}
                      aria-label={`Excluir ${student.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
