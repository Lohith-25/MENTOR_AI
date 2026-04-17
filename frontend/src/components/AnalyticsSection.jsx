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
          '#1D4ED8', // blue-700
          '#4338CA', // indigo-700
          '#BE185D', // pink-700
          '#D97706', // amber-600
          '#059669', // emerald-600
          '#0891B2', // cyan-600
          '#6D28D9', // violet-700
          '#4F46E5', // indigo-600
        ],
        borderColor: '#ffffff',
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
          color: '#475569',
          font: { size: 12, weight: 'bold' },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        padding: 10,
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
        backgroundColor: 'rgba(29, 78, 216, 0.8)', // blue-700
        borderColor: '#1D4ED8',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Max Score',
        data: Object.values(categoryBreakdown).map(d => d.max),
        backgroundColor: '#E2E8F0', // slate-200
        borderColor: '#CBD5E1',
        borderWidth: 1,
        borderRadius: 4,
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
          color: '#475569',
          font: { size: 12, weight: 'bold' },
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        padding: 10,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748B',
          font: { size: 11, weight: '500' },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#64748B',
          font: { size: 11, weight: '500' },
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
      <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Analytics Overview</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Score Distribution</h3>
          <div className="flex justify-center h-80">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Category Comparison</h3>
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
        className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
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
            className="text-center p-5 bg-slate-50 rounded-xl border border-slate-100 shadow-inner"
          >
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{stat.label}</div>
            <div className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AnalyticsSection
