export function formatDate(dateStr: string): string {
  const toKstDateStr = (d: Date) => {
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
    return kst.toISOString().slice(0, 10)
  }

  const now = new Date()
  const date = new Date(dateStr)
  const todayStr = toKstDateStr(now)
  const targetStr = toKstDateStr(date)

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = toKstDateStr(yesterday)

  if (targetStr === todayStr) return '오늘'
  if (targetStr === yesterdayStr) return '어제'

  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return `${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`
}
