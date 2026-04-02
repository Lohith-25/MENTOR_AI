import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

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
        return 'shadow-glow-red'
      case 'yellow':
        return 'shadow-glow-yellow'
      case 'green':
        return 'shadow-glow-green'
      default:
        return 'shadow-glow'
    }
  }

  const getChartColor = () => {
    switch (eligibility.color) {
      case 'red':
        return '#EF4444'
      case 'yellow':
        return '#FBBF24'
      case 'green':
        return '#10B981'
      default:
        return '#3B82F6'
    }
  }

  const chartData = {
    datasets: [
      {
        data: [totalScore, maxScore - totalScore],
        backgroundColor: [getChartColor(), 'rgba(255, 255, 255, 0.05)'],
        borderColor: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataIndex === 0) {
              return `Score: ${totalScore}/${maxScore}`
            }
            return `Remaining: ${maxScore - totalScore}`
          },
        },
      },
    },
    cutout: '70%',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`glass-lg p-12 text-center space-y-6 ${getGlowColor()} transition-all duration-500`}
    >
      {/* Animated gauge */}
      <div className="relative w-64 h-64 mx-auto">
        <Doughnut data={chartData} options={chartOptions} />
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green bg-clip-text">
              {displayScore}
            </div>
            <div className="text-slate-400 text-sm mt-2">/ {maxScore}</div>
          </motion.div>
        </div>
      </div>

      {/* Eligibility Badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className={`inline-block px-8 py-3 rounded-full font-bold text-lg backdrop-blur-md ${
          eligibility.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
          eligibility.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
          'bg-green-500/20 text-green-300 border border-green-500/50'
        }`}>
          {eligibility.tier}
        </div>
      </motion.div>

      {/* Score Range Info */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-slate-400 text-sm"
      >
        <p>
          {eligibility.color === 'red' && 'Keep working on your skills. Target: 100+ points'}
          {eligibility.color === 'yellow' && 'Great! Focus on weak areas to reach 200+ points'}
          {eligibility.color === 'green' && '🎉 Excellent! You\'re well-prepared for placements'}
        </p>
      </motion.div>

      {/* Progress bar with percentage */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1 }}
        className="space-y-2 mt-8"
      >
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Overall Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${
              eligibility.color === 'red' ? 'from-red-500 to-red-400' :
              eligibility.color === 'yellow' ? 'from-yellow-500 to-yellow-400' :
              'from-green-500 to-green-400'
            }`}
          ></motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ScoreCard
