import { CalendarClock } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatDateTime } from '../../../shared/lib/formatters'
import type { StudentResponse } from '../../students/types'
import type { TrainingResponse } from '../../trainings/types'

type RecentTrainingsProps = {
  trainings: TrainingResponse[]
  students: StudentResponse[]
  isLoading: boolean
  isError: boolean
}

export function RecentTrainings({ trainings, students, isLoading, isError }: RecentTrainingsProps) {
  const studentNames = new Map(students.map((student) => [student.id, student.name]))

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm" aria-labelledby="recent-trainings-title">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <CalendarClock size={18} />
          </span>
          <div>
            <h2 id="recent-trainings-title" className="text-sm font-semibold text-slate-950">
              Treinos recentes
            </h2>
            <p className="text-xs text-slate-500">Próximos agendamentos da operação.</p>
          </div>
        </div>

        <Link className="text-sm font-medium text-emerald-700 hover:text-emerald-800" to="/trainings">
          Ver todos
        </Link>
      </div>

      {isLoading ? <p className="px-5 py-6 text-sm text-slate-600">Carregando treinos...</p> : null}

      {isError ? (
        <p className="px-5 py-6 text-sm font-medium text-red-700">Não foi possível carregar os treinos recentes.</p>
      ) : null}

      {!isLoading && !isError && trainings.length === 0 ? (
        <div className="px-5 py-6">
          <p className="text-sm text-slate-600">Nenhum treino agendado.</p>
          <Link
            className="mt-3 inline-flex h-9 items-center rounded-md bg-emerald-700 px-3 text-sm font-medium text-white hover:bg-emerald-800"
            to="/trainings/new"
          >
            Novo treino
          </Link>
        </div>
      ) : null}

      {!isLoading && !isError && trainings.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {trainings.map((training) => (
            <li key={training.id}>
              <Link
                className="block px-5 py-4 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                to={`/trainings/${training.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-950">{training.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {studentNames.get(training.studentId) ?? 'Aluno removido'}
                    </p>
                  </div>
                  <time
                    className="shrink-0 text-right text-xs font-medium text-slate-600"
                    dateTime={training.scheduledForUtc}
                  >
                    {formatDateTime(training.scheduledForUtc)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
