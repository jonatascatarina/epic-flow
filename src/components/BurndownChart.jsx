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
const COLOR_IDEAL_BORDER = '#94A3B8'
const COLOR_IDEAL_FILL   = 'rgba(148,163,184,0.08)'
const COLOR_REAL         = '#3B82F6'
const COLOR_REAL_FILL    = 'rgba(59,130,246,0.10)'

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  spanGaps: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#1E293B',
        boxWidth: 12,
        font: { family: 'Inter, sans-serif', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#1E293B',
      titleColor: '#F8FAFC',
      bodyColor: '#CBD5E1',
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => {
          if (ctx.parsed.y === null) return null
          const unit = ctx.dataset.hasPoints === false ? ' issues' : ' pts'
          const delta = ctx.datasetIndex === 1 && ctx.chart.data.datasets[0]?.data[ctx.dataIndex] != null
            ? ` (Δ ${(ctx.parsed.y - ctx.chart.data.datasets[0].data[ctx.dataIndex]).toFixed(1)})`
            : ''
          return ` ${ctx.dataset.label}: ${ctx.parsed.y}${unit}${delta}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#64748B',
        maxTicksLimit: 10,
        font: { family: 'Inter, sans-serif', size: 11 },
      },
      grid: { color: '#E2E8F0' },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#64748B',
        font: { family: 'Inter, sans-serif', size: 11 },
      },
      grid: { color: '#E2E8F0' },
    },
  },
}

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
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: COLOR_REAL,
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
