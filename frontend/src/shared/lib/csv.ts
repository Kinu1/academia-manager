type CsvCell = string | number | boolean | null | undefined

export type CsvColumn<Row> = {
  header: string
  value: (row: Row) => CsvCell
}

export function toCsv<Row>(columns: CsvColumn<Row>[], rows: Row[]) {
  const header = columns.map((column) => escapeCsvCell(column.header)).join(',')
  const body = rows.map((row) => columns.map((column) => escapeCsvCell(column.value(row))).join(','))

  return [header, ...body].join('\r\n')
}

export function downloadCsv(fileName: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}

function escapeCsvCell(value: CsvCell) {
  const text = value == null ? '' : String(value)
  const escaped = text.replaceAll('"', '""')

  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped
}
