import React from 'react'
import { motion } from 'framer-motion'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AnalyticsSection = ({ categoryBreakdown }) => {
  // Pie chart data - Score distribution
  const pieData = {
    labels: Object.values(categoryBreakdown).map(d => d.name),
    datasets: [
      {
        data: Object.values(categoryBreakdown).map(d => d.score),
        backgroundColor: [
          '#3B82F6',
          '#A855F7',
          '#EC4899',
          '#F59E0B',
          '#10B981',
          '#06B6D4',
          '#8B5CF6',
          '#6366F1',
        ],
        borderColor: [
          'rgba(255, 255, 255, 0.1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed
            return `${label}: ${value} points`
          },
        },
      },
    },
  }

  // Bar chart data - Category comparison
  const barData = {
    labels: Object.values(categoryBreakdown).map(d => d.name),
    datasets: [
      {
        label: 'Score Obtained',
        data: Object.values(categoryBreakdown).map(d => d.score),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Max Score',
        data: Object.values(categoryBreakdown).map(d => d.max),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const barOptions = {
    indexAxis: undefined,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#cbd5e1',
          font: { size: 12 },
          padding: 15,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-slate-100">Analytics Overview</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-lg p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Score Distribution</h3>
          <div className="flex justify-center h-80">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-lg p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Category Comparison</h3>
          <div className="h-80 flex justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </motion.div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Categories', value: Object.keys(categoryBreakdown).length },
          { label: 'Avg Score', value: (Object.values(categoryBreakdown).reduce((sum, d) => sum + d.score, 0) / Object.keys(categoryBreakdown).length).toFixed(1) },
          { label: 'Strongest Area', value: Object.values(categoryBreakdown).reduce((max, d) => d.percentage > max.percentage ? d : max).name.split(' ')[0] },
          { label: 'Needs Improvement', value: Object.values(categoryBreakdown).reduce((min, d) => d.percentage < min.percentage ? d : min).name.split(' ')[0] },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + idx * 0.05 }}
            className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700/30"
          >
            <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AnalyticsSection
