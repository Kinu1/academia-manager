import { CheckCircle2, Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatCurrency } from '../../../shared/lib/formatters'
import { Badge } from '../../../shared/ui/badge'
import type { PlanResponse } from '../types'

type PlansTableProps = {
  plans: PlanResponse[]
  canManage: boolean
  currentPlanId?: string | null
  choosingPlanId?: string
  deletingId?: string
  onChoose?: (id: string) => void
  onDelete: (id: string) => void
}

export function PlansTable({ plans, canManage, currentPlanId, choosingPlanId, deletingId, onChoose, onDelete }: PlansTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Nome</th>
            <th className="px-4 py-3 font-semibold">Valor</th>
            <th className="px-4 py-3 font-semibold">Duração</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {plans.map((plan) => (
            <tr key={plan.id} className="text-slate-700">
              <td className="px-4 py-3 font-medium text-slate-950">{plan.name}</td>
              <td className="px-4 py-3">{formatCurrency(plan.priceAmount, plan.priceCurrency)}</td>
              <td className="px-4 py-3">{plan.durationInDays} dias</td>
              <td className="px-4 py-3">
                <Badge tone={plan.isActive ? 'success' : 'neutral'}>{plan.isActive ? 'Ativo' : 'Inativo'}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {canManage ? (
                    <>
                      <Link
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                        to={`/plans/${plan.id}`}
                        aria-label={`Editar ${plan.name}`}
                      >
                        <Edit size={17} />
                      </Link>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-slate-100 hover:text-red-600 focus-visible:text-red-600 disabled:opacity-50"
                        onClick={() => onDelete(plan.id)}
                        type="button"
                        disabled={deletingId === plan.id}
                        aria-label={`Excluir ${plan.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </>
                  ) : onChoose ? (
                    <button
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => onChoose(plan.id)}
                      type="button"
                      disabled={!plan.isActive || currentPlanId === plan.id || choosingPlanId === plan.id}
                    >
                      <CheckCircle2 size={17} />
                      {currentPlanId === plan.id ? 'Atual' : choosingPlanId === plan.id ? 'Selecionando...' : 'Escolher'}
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
