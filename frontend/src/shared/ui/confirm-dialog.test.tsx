import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmDialog } from './confirm-dialog'

describe('ConfirmDialog', () => {
  it('does not render when closed', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Excluir item"
        description="Confirme a exclusao."
        confirmLabel="Excluir"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog content when open', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir item"
        description="Confirme a exclusao."
        confirmLabel="Excluir"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Excluir item' })).toBeInTheDocument()
    expect(screen.getByText('Confirme a exclusao.')).toBeInTheDocument()
  })

  it('focuses cancel button and restores previous focus when closed', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const { rerender } = render(
      <>
        <button type="button">Abrir</button>
        <ConfirmDialog
          open={false}
          title="Excluir item"
          description="Confirme a exclusao."
          confirmLabel="Excluir"
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </>,
    )
    const trigger = screen.getByRole('button', { name: 'Abrir' })
    trigger.focus()

    rerender(
      <>
        <button type="button">Abrir</button>
        <ConfirmDialog
          open
          title="Excluir item"
          description="Confirme a exclusao."
          confirmLabel="Excluir"
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </>,
    )

    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()

    rerender(
      <>
        <button type="button">Abrir</button>
        <ConfirmDialog
          open={false}
          title="Excluir item"
          description="Confirme a exclusao."
          confirmLabel="Excluir"
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </>,
    )

    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus()
  })

  it('closes with Escape when not confirming', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Excluir item"
        description="Confirme a exclusao."
        confirmLabel="Excluir"
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('keeps keyboard focus inside the dialog', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir item"
        description="Confirme a exclusao."
        confirmLabel="Excluir"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    const confirmButton = screen.getByRole('button', { name: 'Excluir' })

    confirmButton.focus()
    fireEvent.keyDown(window, { key: 'Tab' })

    expect(cancelButton).toHaveFocus()

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })

    expect(confirmButton).toHaveFocus()
  })
})
