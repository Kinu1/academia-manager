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

export function toPtBrDateInputValue(value: string) {
  const match = toDateTimeInputValue(value).match(/^(\d{4})-(\d{2})-(\d{2})T/)

  if (!match) {
    return ''
  }

  const [, year, month, day] = match

  return `${day}/${month}/${year}`
}

export function toTimeInputValue(value: string) {
  const match = toDateTimeInputValue(value).match(/T(\d{2}:\d{2})$/)

  return match?.[1] ?? ''
}

export function toDateTimeInputValue(value: string) {
  const date = new Date(value)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().slice(0, 16)
}

export function toDateInputValue(value: string) {
  return toDateTimeInputValue(value).slice(0, 10)
}

export function toLocalDateTimeValue(date: string, time: string) {
  const parsedDate = parsePtBrDate(date)
  const parsedTime = parseTime(time)

  if (!parsedDate || !parsedTime) {
    return ''
  }

  return `${parsedDate.year}-${parsedDate.month}-${parsedDate.day}T${parsedTime}`
}

export function toUtcIsoString(dateTimeLocal: string) {
  return new Date(dateTimeLocal).toISOString()
}

function parsePtBrDate(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (!match) {
    return null
  }

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null
  }

  return { day, month, year }
}

function parseTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value) ? value : null
}
