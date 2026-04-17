import React from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  Zap,
  GitBranch,
  Trophy,
  TrendingUp,
  Briefcase,
  Target,
  BookOpen,
} from 'lucide-react'

const MetricsGrid = ({ categoryBreakdown }) => {
  const iconMap = {
    coding_problems: Code2,
    leetcode_problems: Zap,
    open_source: GitBranch,
    competitions: Trophy,
    cp_rating: TrendingUp,
    projects: Briefcase,
    aptitude: Target,
    skillrank: BookOpen,
  }

  const getColorByPercentage = (percentage) => {
    if (percentage >= 80) return { bar: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' }
    if (percentage >= 60) return { bar: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' }
    if (percentage >= 40) return { bar: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' }
    return { bar: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight px-4 sm:px-0">Performance Breakdown</h2>
      
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 px-4 sm:px-0">
        {Object.entries(categoryBreakdown).map(([key, category], idx) => {
          const Icon = iconMap[key]
          const { bar, text, light } = getColorByPercentage(category.percentage)
          
          return (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group bg-white border border-slate-200 rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              <div className="relative p-3 md:p-6 space-y-3 md:space-y-5">
                {/* Header with icon and name */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <div className={`p-1.5 md:p-2 rounded-lg ${light} text-slate-700 group-hover:text-blue-700 group-hover:bg-blue-50 transition-colors`}>
                        <Icon size={18} className="md:w-5 md:h-5" />
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm md:text-base text-slate-800 transition-all">{category.name}</h3>
                    </div>
                  </div>
                  <div className={`text-lg md:text-xl font-black ${text}`}>
                    {category.percentage.toFixed(0)}%
                  </div>
                </div>

                {/* Score display */}
                <div className="text-sm font-semibold flex justify-between">
                  <span className="text-slate-500 uppercase tracking-widest text-xs">Score</span>
                  <span className="text-slate-800">{category.score} / {category.max}</span>
                </div>

                {/* Animated progress bar */}
                <div className="space-y-2">
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ delay: idx * 0.05 + 0.3, duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${bar}`}
                    ></motion.div>
                  </div>
                </div>

                {/* Weight info */}
                <motion.div
                  className="text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 flex items-center justify-between"
                >
                  <span>Weight impact</span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-600 border border-slate-100">{(category.weight * 100).toFixed(0)}%</span>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Heatmap Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-4 gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm"
      >
        <div className="text-center">
          <div className="h-3 rounded-md bg-green-500 mb-2 shadow-sm"></div>
          <div className="text-slate-600 font-semibold text-xs">80%+</div>
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Excellent</div>
        </div>
        <div className="text-center">
          <div className="h-3 rounded-md bg-blue-500 mb-2 shadow-sm"></div>
          <div className="text-slate-600 font-semibold text-xs">60-80%</div>
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Good</div>
        </div>
        <div className="text-center">
          <div className="h-3 rounded-md bg-amber-500 mb-2 shadow-sm"></div>
          <div className="text-slate-600 font-semibold text-xs">40-60%</div>
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Average</div>
        </div>
        <div className="text-center">
          <div className="h-3 rounded-md bg-red-500 mb-2 shadow-sm"></div>
          <div className="text-slate-600 font-semibold text-xs">&lt;40%</div>
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Needs Work</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MetricsGrid
