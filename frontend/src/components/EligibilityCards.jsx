import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Star } from 'lucide-react'

const EligibilityCards = ({ currentTier }) => {
  const tiers = [
    {
      name: 'Below 5 LPA',
      color: 'red',
      icon: AlertCircle,
      range: '< 100 points',
      description: 'Entry-level roles. Keep improving skills.',
      benefits: ['Internships', 'Trainee programs', 'Campus ambassador'],
    },
    {
      name: '5–10 LPA',
      color: 'yellow',
      icon: Star,
      range: '100-200 points',
      description: 'Mid-level positions. Good opportunity.',
      benefits: ['Graduate roles', 'Developer positions', 'Consulting'],
    },
    {
      name: 'Above 10 LPA',
      color: 'green',
      icon: CheckCircle,
      range: '200+ points',
      description: 'Senior roles. Excellent opportunity!',
      benefits: ['Senior developer', 'Tech lead', 'Fast-track programs'],
    },
  ]

  const getTierColor = (color) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-500/50',
          glow: 'shadow-glow-red',
          gradient: 'from-red-600 to-red-500',
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-500/50',
          glow: 'shadow-glow-yellow',
          gradient: 'from-yellow-600 to-yellow-500',
        }
      case 'green':
        return {
          bg: 'bg-green-900/20',
          border: 'border-green-500/50',
          glow: 'shadow-glow-green',
          gradient: 'from-green-600 to-green-500',
        }
      default:
        return {}
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.320, 1] },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-slate-100">Eligibility Status</h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tiers.map((tier, idx) => {
          const colors = getTierColor(tier.color)
          const isCurrentTier = currentTier === tier.name
          const Icon = tier.icon

          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={isCurrentTier ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
              className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${colors.bg} ${colors.border} ${isCurrentTier ? colors.glow : ''}`}
            >
              {/* Animated background for current tier */}
              {isCurrentTier && (
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-5`}
                ></motion.div>
              )}

              <div className="relative z-10 space-y-4">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`p-3 rounded-lg bg-gradient-to-br ${colors.gradient}/20`}
                  >
                    <Icon className={`text-${tier.color}-400`} size={32} />
                  </motion.div>

                  {isCurrentTier && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-xs font-bold text-white"
                    >
                      Current Tier
                    </motion.div>
                  )}
                </div>

                {/* Tier Name */}
                <div>
                  <h3 className={`text-xl font-bold mb-1 text-${tier.color}-300`}>{tier.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{tier.range}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">{tier.description}</p>

                {/* Benefits */}
                <div className="space-y-2 pt-4 border-t border-slate-700/30">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Eligible for:</p>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, benefitIdx) => (
                      <motion.li
                        key={benefitIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + idx * 0.15 + benefitIdx * 0.05 }}
                        className="text-sm text-slate-300 flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ delay: 1 + idx * 0.15 + benefitIdx * 0.1, duration: 1.5 }}
                          className={`w-1.5 h-1.5 rounded-full bg-${tier.color}-400`}
                        ></motion.div>
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Progress indicator for current tier */}
                {isCurrentTier && (
                  <motion.div
                    className="mt-4 h-1 bg-slate-700/30 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1 + idx * 0.15 }}
                  >
                    <motion.div
                      animate={{ scaleX: [0, 1] }}
                      transition={{ delay: 1.2 + idx * 0.15, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${colors.gradient}`}
                      style={{ originX: 0 }}
                    ></motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default EligibilityCards
