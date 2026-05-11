export type SortDirection = 'asc' | 'desc'

export function compareText(left: string, right: string, direction: SortDirection) {
  return applyDirection(left.localeCompare(right, 'pt-BR', { sensitivity: 'base' }), direction)
}

export function compareNumber(left: number, right: number, direction: SortDirection) {
  return applyDirection(left - right, direction)
}

export function compareDate(left: string, right: string, direction: SortDirection) {
  return compareNumber(new Date(left).getTime(), new Date(right).getTime(), direction)
}

function applyDirection(value: number, direction: SortDirection) {
  return direction === 'asc' ? value : -value
}
