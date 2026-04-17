import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const ScoreCard = ({ totalScore, maxScore, eligibility }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const percentage = (totalScore / maxScore) * 100

  // Animate score from 0 to final value
  useEffect(() => {
    let animationFrame
    let currentValue = 0

    const animate = () => {
      currentValue += (totalScore - currentValue) * 0.08
      if (currentValue < totalScore - 1) {
        setDisplayScore(Math.floor(currentValue))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setDisplayScore(Math.floor(totalScore))
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [totalScore])

  // Determine colors based on eligibility
  const getGlowColor = () => {
    switch (eligibility.color) {
      case 'red':
        return 'shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-red-100'
      case 'yellow':
        return 'shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-yellow-100'
      case 'green':
        return 'shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-green-100'
      default:
        return 'shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-blue-100'
    }
  }

  const getChartColor = () => {
    switch (eligibility.color) {
      case 'red':
        return '#EF4444' // red-500
      case 'yellow':
        return '#F59E0B' // amber-500
      case 'green':
        return '#10B981' // emerald-500
      default:
        return '#3B82F6' // blue-500
    }
  }

  const chartData = [
    { name: 'Score', value: totalScore, color: getChartColor() },
    { name: 'Remaining', value: maxScore - totalScore, color: '#F1F5F9' }
  ]

  const COLORS = [getChartColor(), '#F1F5F9']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 text-center space-y-6 md:space-y-8 ${getGlowColor()} ring-1 transition-all duration-500`}
    >
      {/* Animated gauge */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mx-auto filter drop-shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex flex-col items-center mt-4"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter">
              {displayScore}
            </div>
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs sm:text-sm mt-1">/ {maxScore}</div>
          </motion.div>
        </div>
      </div>

      {/* Eligibility Badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className={`inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-bold sm:font-extrabold text-sm sm:text-base md:text-lg shadow-sm border ${
          eligibility.color === 'green'
            ? 'bg-green-50 text-green-700 border-green-200'
            : eligibility.color === 'yellow'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {eligibility.tier}
        </div>
      </motion.div>

      {/* Score Range Info */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-slate-600 font-medium max-w-lg mx-auto leading-relaxed"
      >
        <p>
          {eligibility.tier === 'Not Yet Eligible' &&
            'Build your profile across all 8 checkpoints to reach at least 70 marks.'}
          {eligibility.tier === 'Below 5 LPA' &&
            'You are eligible for below 5 LPA. Push towards 130+ marks for higher packages.'}
          {eligibility.tier === 'Above 5 to Below 10 LPA' &&
            'Strong profile. Closing a few gaps can move you to 260+ marks and 10 LPA+.'}
          {eligibility.tier === 'Above 10 LPA' &&
            "🎉 Excellent! You meet the criteria for 10 LPA and above."}
        </p>
      </motion.div>

      {/* Progress bar with percentage */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1 }}
        className="space-y-3 mt-10 max-w-xl mx-auto"
      >
        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
          <span className="uppercase tracking-wider text-xs text-slate-500">Overall Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
            className={`h-full rounded-full shadow-sm ${
              eligibility.color === 'green'
                ? 'bg-green-500'
                : eligibility.color === 'yellow'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
          ></motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ScoreCard
