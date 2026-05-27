/**
 * Generates the day-by-day x-axis labels between two dates (inclusive).
 * Returns an array of 'YYYY-MM-DD' strings.
 */
export function sprintDays(startDate, endDate) {
  const days = []
  const cursor = new Date(startDate)
  const end = new Date(endDate)

  // Strip time so comparisons are date-only
  cursor.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  while (cursor <= end) {
    days.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

/**
 * Builds ideal burndown: linear decrease from totalPoints on day 0 to 0 on last day.
 * Returns an array of numbers the same length as `days`.
 */
export function idealLine(days, totalPoints) {
  const n = days.length
  if (n === 0) return []
  if (n === 1) return [totalPoints]

  return days.map((_, i) => {
    const value = totalPoints - (totalPoints / (n - 1)) * i
    return Math.round(value * 10) / 10
  })
}

/**
 * Builds the "real" burndown with only two anchor points:
 *   - day 0 → totalPoints (sprint started full)
 *   - today → remainingPoints (inProgress + todo story points)
 *
 * All other days are null so Chart.js renders a sparse line.
 * If today is outside the sprint range the last day in range is used.
 *
 * @param {string[]} days       - output of sprintDays()
 * @param {number}   totalPoints
 * @param {number}   remainingPoints
 * @returns {(number|null)[]}
 */
export function realLine(days, totalPoints, remainingPoints) {
  if (!days.length) return []

  const today = new Date().toISOString().slice(0, 10)
  const todayIdx = days.indexOf(today)
  // clamp: before sprint → 0, after sprint → last day
  const anchorIdx = todayIdx === -1
    ? (today < days[0] ? 0 : days.length - 1)
    : todayIdx

  return days.map((_, i) => {
    if (i === 0) return totalPoints
    if (i === anchorIdx) return remainingPoints
    return null
  })
}

/**
 * Main export: computes all burndown chart data from issues + sprint dates.
 *
 * @param {object[]} issues
 * @param {{ startDate: string, endDate: string }} sprint
 * @param {{ points: { total: number, todo: number, inProgress: number } }} metrics
 *   - pass the output of calcMetrics() directly
 * @returns {{ labels: string[], ideal: number[], real: (number|null)[], hasPoints: boolean }}
 */
export function calcBurndown(issues, sprint, metrics) {
  const hasPoints = metrics?.points?.available ?? false
  const totalPoints = hasPoints ? (metrics.points.total ?? 0) : issues.length
  const remainingPoints = hasPoints
    ? (metrics.points.todo + metrics.points.inProgress)
    : (metrics.todo + metrics.inProgress)

  const days = sprintDays(sprint.startDate, sprint.endDate)

  return {
    labels: days,
    ideal: idealLine(days, totalPoints),
    real: realLine(days, totalPoints, remainingPoints),
    hasPoints,
  }
}
