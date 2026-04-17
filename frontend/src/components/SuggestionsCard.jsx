import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ArrowRight, X, ChevronRight } from 'lucide-react'

const SuggestionsCard = ({ suggestions }) => {
  const [expandedIdx, setExpandedIdx] = useState(null)

  const expandDetails = {
    'Solve 100+ more coding problems': [
      'Focus on algorithms and data structures',
      'Use platforms: HackerRank, CodeSignal, InterviewBit',
      'Practice daily for 1-2 hours',
      'Target: 2-3 problems per day',
    ],
    'Complete 100+ LeetCode problems': [
      'Start with Easy (50 problems)',
      'Move to Medium (40 problems)',
      'Finally, Hard (10 problems)',
      'Focus on interview patterns',
    ],
    'Contribute to 3+ open-source projects': [
      'Find projects on GitHub matching your skills',
      'Start with documentation PRs',
      'Graduate to feature PRs',
      'Aim for 5+ merged contributions per project',
    ],
    'Participate in 5+ programming competitions': [
      'Join: CodeChef, Codeforces, AtCoder',
      'Participate in monthly contests',
      'Review solutions after each contest',
      'Target: 1-2 contests per month',
    ],
    'Increase competitive programming rating': [
      'Practice contest problems',
      'Learn new algorithms weekly',
      'Participate in live contests',
      'Target: 1500+ rating',
    ],
    'Build 3+ full-stack projects': [
      'Choose real-world problems',
      'Use: React/Vue + Node.js + Database',
      'Deploy on Heroku/Vercel/AWS',
      'Document on GitHub with README',
    ],
    'Practice aptitude questions daily': [
      'Use: IndiaBix, GeeksforGeeks',
      'Focus: Quantitative + Logical',
      'Daily: 30 mins of practice',
      'Target: 80+ accuracy',
    ],
    'Complete 10+ projects on SkillRank': [
      'Complete all beginner projects first',
      'Graduate to intermediate',
      'Focus on code quality',
      'Target: 4.5+ rating average',
    ],
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg shadow-inner border border-yellow-200"
        >
          <Lightbulb className="text-yellow-600" size={24} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">How to Improve</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Smart suggestions based on your weak areas</p>
        </div>
      </div>

      {/* Suggestions List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {suggestions.map((suggestion, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="cursor-pointer"
          >
            <motion.div
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="p-5 bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 rounded-xl flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.05 }}
                  className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0 shadow-sm"
                ></motion.div>
                <div className="flex-1">
                  <p className="text-slate-800 font-bold leading-relaxed">{suggestion}</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedIdx === idx ? 90 : 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="mt-1 flex-shrink-0 bg-white p-1 rounded-full shadow-sm border border-slate-100"
              >
                <ChevronRight size={18} className="text-blue-600" />
              </motion.div>
            </motion.div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 ml-4 mt-2 rounded-xl bg-slate-100 border border-slate-200 space-y-3 shadow-inner">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Action Plan</p>
                    {expandDetails[suggestion]?.map((detail, detailIdx) => (
                      <motion.div
                        key={detailIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * detailIdx }}
                        className="flex items-start gap-3 text-sm font-medium text-slate-600"
                      >
                        <ArrowRight size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-center shadow-sm"
      >
        <p className="text-blue-900 font-medium text-sm">
          💡 <span className="font-extrabold text-blue-800 tracking-wide uppercase text-xs">Pro Tip:</span> Focus on your weakest areas first. Each improvement compounds over time!
        </p>
      </motion.div>
    </motion.div>
  )
}

export default SuggestionsCard
