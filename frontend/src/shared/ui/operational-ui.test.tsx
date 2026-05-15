import { Activity, Plus } from 'lucide-react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './empty-state'
import { PageHeader } from './page-header'
import { StatCard } from './stat-card'
import { Timeline } from './timeline'

describe('operational UI components', () => {
  it('renders a page header with title, description and actions', () => {
    render(
      <PageHeader
        eyebrow="Operacao"
        title="Hoje na academia"
        description="Resumo das acoes prioritarias."
        actions={<button type="button">Novo aluno</button>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Hoje na academia' })).toBeInTheDocument()
    expect(screen.getByText('Resumo das acoes prioritarias.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novo aluno' })).toBeInTheDocument()
  })

  it('renders an empty state with a clear action', () => {
    render(
      <EmptyState
        icon={Plus}
        title="Nenhum treino hoje"
        description="Agende um treino para preencher a rotina da academia."
        action={<button type="button">Agendar treino</button>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Nenhum treino hoje' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Agendar treino' })).toBeInTheDocument()
  })

  it('renders stat cards with accessible labels', () => {
    render(<StatCard icon={Activity} label="Alunos ativos" value="18" description="Operacao em andamento" />)

    expect(screen.getByLabelText('Alunos ativos: 18')).toBeInTheDocument()
    expect(screen.getByText('Operacao em andamento')).toBeInTheDocument()
  })

  it('renders timeline items as an ordered list', () => {
    render(
      <Timeline
        items={[
          {
            id: 'created',
            title: 'Aluno cadastrado',
            description: 'Entrada criada no sistema.',
            timestamp: '2026-05-15T10:00:00.000Z',
          },
        ]}
      />,
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByText('Aluno cadastrado')).toBeInTheDocument()
  })
})
