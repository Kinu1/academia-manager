export type ToastTone = 'success' | 'danger' | 'info'

export type ToastMessage = {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

export type ToastInput = Omit<ToastMessage, 'id'>

export type ToastAction = { type: 'add'; toast: ToastMessage } | { type: 'remove'; id: string }

export function toastReducer(state: ToastMessage[], action: ToastAction) {
  switch (action.type) {
    case 'add':
      return [action.toast, ...state].slice(0, 4)
    case 'remove':
      return state.filter((toast) => toast.id !== action.id)
    default:
      return state
  }
}
