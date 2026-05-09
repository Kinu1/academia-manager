import { describe, expect, it, vi } from 'vitest'

import { emitSessionExpired, SESSION_EXPIRED_EVENT } from './auth-events'

describe('emitSessionExpired', () => {
  it('dispatches session expired event', () => {
    const listener = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, listener)

    emitSessionExpired()

    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(SESSION_EXPIRED_EVENT, listener)
  })
})
