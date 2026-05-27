import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { calcBurndown } from '../utils/burndown'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

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
      labels: { color: 'var(--color-text)', boxWidth: 12 },
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
      ticks: { color: 'var(--color-text-muted)', maxTicksLimit: 10 },
      grid: { color: 'var(--color-border)' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: 'var(--color-text-muted)' },
      grid: { color: 'var(--color-border)' },
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
        borderColor: 'var(--color-accent)',
        borderDash: [6, 3],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
        hasPoints,
      },
      {
        label: 'Real',
        data: real,
        borderColor: 'var(--color-danger)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0,
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
