import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { toLocalDateTimeValue, toPtBrDateInputValue, toTimeInputValue } from '../lib/formatters'

type DateTimeFieldProps = {
  label: string
  error?: string
  value?: string
  name?: string
  disabled?: boolean
  onBlur?: () => void
  onChange: (value: string) => void
}

type CalendarDay = {
  date: Date
  dayNumber: number
  inCurrentMonth: boolean
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function DateTimeField({
  label,
  error,
  value = '',
  name,
  disabled = false,
  onBlur,
  onChange,
}: DateTimeFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [dateValue, setDateValue] = useState('')
  const [hourValue, setHourValue] = useState('00')
  const [minuteValue, setMinuteValue] = useState('00')
  const [viewDate, setViewDate] = useState(() => new Date())

  useEffect(() => {
    const nextDateValue = value ? toPtBrDateInputValue(value) : ''
    const nextTimeValue = value ? toTimeInputValue(value) : ''
    const [nextHours = '00', nextMinutes = '00'] = nextTimeValue.split(':')
    const nextViewDate = parseLocalDateTimeValue(value)

    setDateValue(nextDateValue)
    setHourValue(nextHours)
    setMinuteValue(nextMinutes)
    setViewDate(nextViewDate ?? new Date())
  }, [value])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate])
  const timeValue = isValidTime(hourValue, minuteValue) ? `${hourValue}:${minuteValue}` : ''

  function syncValue(nextDate: string, nextHours: string, nextMinutes: string) {
    onChange(toLocalDateTimeValue(nextDate, `${nextHours}:${nextMinutes}`))
  }

  function handleSelectDay(date: Date) {
    const nextDateValue = formatPtBrDate(date)

    setDateValue(nextDateValue)
    setViewDate(date)
    syncValue(nextDateValue, hourValue, minuteValue)
  }

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <div className="relative" ref={rootRef}>
        <div className="grid grid-cols-[minmax(0,1fr)_10rem] gap-3">
          <button
            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-left text-sm outline-none transition hover:border-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={disabled}
            name={name ? `${name}-date-trigger` : undefined}
            onBlur={onBlur}
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <span className={dateValue ? 'text-slate-900' : 'text-slate-400'}>{dateValue || 'dd/mm/aaaa'}</span>
            <CalendarDays size={16} className="shrink-0 text-slate-500" />
          </button>

          <button
            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-left text-sm outline-none transition hover:border-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={disabled}
            name={name ? `${name}-time-trigger` : undefined}
            onBlur={onBlur}
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <span className={timeValue ? 'text-slate-900' : 'text-slate-400'}>{timeValue || 'hh:mm'}</span>
            <Clock3 size={16} className="shrink-0 text-slate-500" />
          </button>
        </div>

        {isOpen ? (
          <div className="absolute z-30 mt-2 w-full min-w-[19rem] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_9rem]">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                    type="button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <p className="text-sm font-semibold text-slate-900">
                    {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                    type="button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                  {weekDays.map((weekDay) => (
                    <span key={weekDay} className="py-1">
                      {weekDay}
                    </span>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const isSelected = dateValue === formatPtBrDate(day.date)

                    return (
                      <button
                        className={[
                          'flex h-9 items-center justify-center rounded-md text-sm transition',
                          day.inCurrentMonth ? 'text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-50',
                          isSelected ? 'bg-emerald-600 font-semibold text-white hover:bg-emerald-600' : '',
                        ].join(' ')}
                        key={day.date.toISOString()}
                        onClick={() => handleSelectDay(day.date)}
                        type="button"
                      >
                        {day.dayNumber}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Horário</p>
                  <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <select
                      className="h-10 rounded-md border border-slate-300 bg-white px-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      onChange={(event) => {
                        const nextHours = event.target.value
                        setHourValue(nextHours)
                        syncValue(dateValue, nextHours, minuteValue)
                      }}
                      value={hourValue}
                    >
                      {Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0')).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm font-medium text-slate-500">:</span>
                    <select
                      className="h-10 rounded-md border border-slate-300 bg-white px-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      onChange={(event) => {
                        const nextMinutes = event.target.value
                        setMinuteValue(nextMinutes)
                        syncValue(dateValue, hourValue, nextMinutes)
                      }}
                      value={minuteValue}
                    >
                      {Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0')).map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : null}
      </div>
      {error ? <span className="block text-sm text-red-600">{error}</span> : null}
    </label>
  )
}

function buildCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const leadingDays = firstDayOfMonth.getDay()
  const trailingDays = 6 - lastDayOfMonth.getDay()
  const days: CalendarDay[] = []

  for (let offset = leadingDays; offset > 0; offset -= 1) {
    const date = new Date(year, month, 1 - offset)
    days.push({ date, dayNumber: date.getDate(), inCurrentMonth: false })
  }

  for (let day = 1; day <= lastDayOfMonth.getDate(); day += 1) {
    const date = new Date(year, month, day)
    days.push({ date, dayNumber: day, inCurrentMonth: true })
  }

  for (let day = 1; day <= trailingDays; day += 1) {
    const date = new Date(year, month + 1, day)
    days.push({ date, dayNumber: day, inCurrentMonth: false })
  }

  return days
}

function formatPtBrDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function parseLocalDateTimeValue(value: string) {
  if (!value) {
    return null
  }

  const [datePart] = value.split('T')

  if (!datePart) {
    return null
  }

  const [year, month, day] = datePart.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

function isValidTime(hours: string, minutes: string) {
  return /^\d{2}$/.test(hours) && /^\d{2}$/.test(minutes)
}
