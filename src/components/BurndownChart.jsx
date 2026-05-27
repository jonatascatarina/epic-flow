import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { calcBurndown } from '../utils/burndown'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Chart.js renders on <canvas> — CSS custom properties are not resolved by the
// 2D context, so colours must be literal values.
const COLOR_IDEAL_BORDER = 'rgba(255,255,255,0.35)'
const COLOR_IDEAL_FILL   = 'rgba(255,255,255,0.05)'
const COLOR_REAL         = '#4A9EE8'
const COLOR_REAL_FILL    = 'rgba(74,158,232,0.12)'

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  spanGaps: true, // connect across null values in the real line
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#e6edf3', boxWidth: 12 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          if (ctx.parsed.y === null) return null
          const unit = ctx.dataset.hasPoints === false ? ' issues' : ' pts'
          return ` ${ctx.dataset.label}: ${ctx.parsed.y}${unit}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#8b949e', maxTicksLimit: 10 },
      grid: { color: '#30363d' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#8b949e' },
      grid: { color: '#30363d' },
    },
  },
}

/**
 * @param {{ issues: object[], sprint: { startDate: string, endDate: string }, metrics: object }} props
 *   sprint and metrics come from the parent (Dashboard); metrics is the output of calcMetrics()
 */
export default function BurndownChart({ issues, sprint, metrics }) {
  if (!sprint?.startDate || !sprint?.endDate) {
    return (
      <div className="burndown-placeholder">
        <p>Datas do sprint não disponíveis. Adicione as datas em Configurações para ver o burndown.</p>
      </div>
    )
  }

  if (!issues?.length) {
    return (
      <div className="burndown-placeholder">
        <p>Nenhuma issue encontrada para o sprint.</p>
      </div>
    )
  }

  const { labels, ideal, real, hasPoints } = calcBurndown(issues, sprint, metrics)

  const data = {
    labels,
    datasets: [
      {
        label: 'Ideal',
        data: ideal,
        borderColor: COLOR_IDEAL_BORDER,
        backgroundColor: COLOR_IDEAL_FILL,
        borderDash: [6, 3],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
        fill: true,
        hasPoints,
      },
      {
        label: 'Real',
        data: real,
        borderColor: COLOR_REAL,
        backgroundColor: COLOR_REAL_FILL,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0,
        fill: true,
        hasPoints,
      },
    ],
  }

  return (
    <div className="burndown-chart">
      <Line data={data} options={OPTIONS} />
    </div>
  )
}
