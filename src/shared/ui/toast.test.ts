import { describe, expect, it } from 'vitest'

import { toastReducer, type ToastMessage } from './toast-state'

describe('toastReducer', () => {
  it('adds a toast message', () => {
    const toast: ToastMessage = {
      id: 'toast-1',
      title: 'Salvo',
      tone: 'success',
    }

    expect(toastReducer([], { type: 'add', toast })).toEqual([toast])
  })

  it('removes a toast message', () => {
    const toast: ToastMessage = {
      id: 'toast-1',
      title: 'Salvo',
      tone: 'success',
    }

    expect(toastReducer([toast], { type: 'remove', id: 'toast-1' })).toEqual([])
  })
})
