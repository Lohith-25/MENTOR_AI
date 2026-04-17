import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const AnalyticsSection = ({ categoryBreakdown }) => {
  // Convert category breakdown to Recharts format
  const chartData = Object.values(categoryBreakdown).map(d => ({
    name: d.name,
    score: d.score,
    max: d.max,
    percentage: d.percentage || (d.score / d.max * 100)
  }))

  const COLORS = ['#1D4ED8', '#4338CA', '#BE185D', '#D97706', '#059669', '#0891B2', '#6D28D9', '#4F46E5']

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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${(percentage || 0).toFixed(0)}%`}
                outerRadius={100}
                fill="#1D4ED8"
                dataKey="score"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} points`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Category Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#1D4ED8" name="Score Obtained" />
              <Bar dataKey="max" fill="#E2E8F0" name="Max Score" />
            </BarChart>
          </ResponsiveContainer>
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
          { label: 'Total Categories', value: chartData.length },
          { label: 'Avg Score', value: (chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length).toFixed(1) },
          { label: 'Strongest Area', value: chartData.reduce((max, d) => d.percentage > (max.percentage || 0) ? d : max, {}).name?.split(' ')[0] || 'N/A' },
          { label: 'Needs Improvement', value: chartData.reduce((min, d) => d.percentage < (min.percentage || 100) ? d : min, { percentage: 100 }).name?.split(' ')[0] || 'N/A' },
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
