export const SESSION_EXPIRED_EVENT = 'academia-manager:session-expired'

export function emitSessionExpired() {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}
