export function toISODateTime(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toISOString()
}
