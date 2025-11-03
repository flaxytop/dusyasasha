export function diffInDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function getRelationshipMetrics(startISO: string) {
  const start = new Date(startISO)
  const now = new Date()
  const totalDays = diffInDays(start, now)

  // Years completed
  let years = now.getFullYear() - start.getFullYear()
  const thisYearAnniv = new Date(start)
  thisYearAnniv.setFullYear(now.getFullYear())
  if (now < thisYearAnniv) years -= 1

  // Next anniversary
  const nextAnniv = new Date(start)
  nextAnniv.setFullYear(start.getFullYear() + years + 1)

  // Days in current year span
  const prevAnniv = new Date(start)
  prevAnniv.setFullYear(start.getFullYear() + years)
  const daysSincePrevAnniv = Math.max(0, diffInDays(prevAnniv, now))
  const daysBetweenAnnivs = Math.max(1, diffInDays(prevAnniv, nextAnniv))
  const percentYearProgress = Math.min(100, Math.max(0, Math.round((daysSincePrevAnniv / daysBetweenAnnivs) * 100)))

  // Months since start
  let monthsSinceStart = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (now.getDate() < start.getDate()) monthsSinceStart -= 1
  monthsSinceStart = Math.max(0, monthsSinceStart)

  return {
    yearsCompleted: Math.max(0, years),
    monthsSinceStart,
    daysSinceStart: Math.max(0, totalDays),
    nextAnniversaryDate: nextAnniv,
    daysToNextAnniversary: Math.max(0, diffInDays(now, nextAnniv)),
    percentYearProgress
  }
}


