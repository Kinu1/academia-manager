import { describe, expect, it } from 'vitest'

import { toCsv } from './csv'

describe('toCsv', () => {
  it('serializes rows with headers', () => {
    const csv = toCsv(
      [
        { header: 'Nome', value: (row: { name: string; active: boolean }) => row.name },
        { header: 'Ativo', value: (row) => row.active },
      ],
      [{ name: 'Maria', active: true }],
    )

    expect(csv).toBe('Nome,Ativo\r\nMaria,true')
  })

  it('escapes commas, quotes, new lines, null and undefined values', () => {
    const csv = toCsv(
      [
        { header: 'Texto', value: (row: { text?: string | null }) => row.text },
        { header: 'Observacao', value: (row) => row.text },
      ],
      [{ text: 'Plano "Gold", anual' }, { text: 'Linha 1\nLinha 2' }, { text: null }, {}],
    )

    expect(csv).toBe(
      'Texto,Observacao\r\n"Plano ""Gold"", anual","Plano ""Gold"", anual"\r\n"Linha 1\nLinha 2","Linha 1\nLinha 2"\r\n,\r\n,',
    )
  })
})
