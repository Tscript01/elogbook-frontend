export const toDate = (iso: string): Date => new Date(`${iso.slice(0, 10)}T00:00:00.000Z`)

export const addDays = (iso: string, days: number): string => {
  const date = toDate(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export const formatLongDate = (iso: string): string =>
  toDate(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })

export const formatShortDate = (iso: string): string =>
  toDate(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })

export const formatDayLabel = (iso: string): string =>
  toDate(iso).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })

export const formatDayNumber = (iso: string): string =>
  toDate(iso).toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'UTC' })

export const formatRange = (startIso: string, endIso: string): string =>
  `${formatShortDate(startIso)} - ${formatShortDate(endIso)}`

export const daysBetween = (startIso: string, endIso: string): number =>
  Math.round((toDate(endIso).getTime() - toDate(startIso).getTime()) / 86400000)
