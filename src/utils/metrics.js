// customfield_10016 = story points (Jira classic)
// customfield_10028 = story point estimate (Jira next-gen)
function getStoryPoints(issue) {
  const v = issue.fields?.customfield_10016 ?? issue.fields?.customfield_10028
  return typeof v === 'number' ? v : null
}

// Maps Jira statusCategory.key to one of three buckets
function getStatusCategory(issue) {
  const key = issue.fields?.status?.statusCategory?.key
  if (key === 'done') return 'done'
  if (key === 'indeterminate') return 'inProgress'
  if (key === 'new') return 'todo'
  return 'todo' // treat unknown statuses as todo
}

/**
 * Calculates sprint metrics from a Jira issues array.
 *
 * @param {object[]} issues - raw issues from useJira
 * @returns {{
 *   total: number,
 *   done: number,
 *   inProgress: number,
 *   todo: number,
 *   percent: number,
 *   points: {
 *     available: boolean,
 *     total: number,
 *     done: number,
 *     inProgress: number,
 *     todo: number,
 *   }
 * }}
 */
export function calcMetrics(issues) {
  if (!issues?.length) {
    return {
      total: 0,
      done: 0,
      inProgress: 0,
      todo: 0,
      percent: 0,
      points: { available: false, total: 0, done: 0, inProgress: 0, todo: 0 },
    }
  }

  let done = 0
  let inProgress = 0
  let todo = 0
  let ptsDone = 0
  let ptsInProgress = 0
  let ptsTodo = 0
  let ptsAvailable = false

  for (const issue of issues) {
    const category = getStatusCategory(issue)
    const pts = getStoryPoints(issue)

    if (category === 'done') done++
    else if (category === 'inProgress') inProgress++
    else todo++

    if (pts !== null) {
      ptsAvailable = true
      if (category === 'done') ptsDone += pts
      else if (category === 'inProgress') ptsInProgress += pts
      else ptsTodo += pts
    }
  }

  const total = issues.length
  const percent = total > 0 ? Math.round((done / total) * 1000) / 10 : 0

  return {
    total,
    done,
    inProgress,
    todo,
    percent,
    points: {
      available: ptsAvailable,
      total: ptsDone + ptsInProgress + ptsTodo,
      done: ptsDone,
      inProgress: ptsInProgress,
      todo: ptsTodo,
    },
  }
}
