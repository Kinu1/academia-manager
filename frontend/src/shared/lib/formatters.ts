export function formatCurrency(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function toDateTimeInputValue(value: string) {
  const date = new Date(value)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().slice(0, 16)
}

export function toDateInputValue(value: string) {
  return toDateTimeInputValue(value).slice(0, 10)
}

export function toUtcIsoString(dateTimeLocal: string) {
  return new Date(dateTimeLocal).toISOString()
}
