import { Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatDateTime } from '../../../shared/lib/formatters'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../types'

type TrainingsTableProps = {
  trainings: TrainingResponse[]
  students: StudentResponse[]
  canManage: boolean
  deletingId?: string
  onDelete: (id: string) => void
}

export function TrainingsTable({ trainings, students, canManage, deletingId, onDelete }: TrainingsTableProps) {
  const studentNames = new Map(students.map((student) => [student.id, student.name]))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Titulo</th>
            <th className="px-4 py-3 font-semibold">Aluno</th>
            <th className="px-4 py-3 font-semibold">Descricao</th>
            <th className="px-4 py-3 font-semibold">Agendado</th>
            <th className="px-4 py-3 text-right font-semibold">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {trainings.map((training) => (
            <tr key={training.id} className="text-slate-700">
              <td className="px-4 py-3 font-medium text-slate-950">{training.title}</td>
              <td className="px-4 py-3">{studentNames.get(training.studentId) ?? 'Aluno removido'}</td>
              <td className="px-4 py-3">{training.description}</td>
              <td className="px-4 py-3">{formatDateTime(training.scheduledForUtc)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                    to={`/trainings/${training.id}`}
                    aria-label={`Editar ${training.title}`}
                  >
                    <Edit size={17} />
                  </Link>
                  {canManage ? (
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => onDelete(training.id)}
                      type="button"
                      disabled={deletingId === training.id}
                      aria-label={`Excluir ${training.title}`}
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
