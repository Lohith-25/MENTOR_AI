import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Star } from 'lucide-react'

const EligibilityCards = ({ currentTier }) => {
  const tiers = [
    {
      name: 'Not Yet Eligible',
      color: 'red',
      icon: AlertCircle,
      range: '< 70 marks',
      description: 'You need at least 70 marks across the checkpoints to enter the eligibility band.',
      benefits: ['Skill-building plan', 'Foundation courses', 'Peer coding groups'],
    },
    {
      name: 'Below 5 LPA',
      color: 'red',
      icon: AlertCircle,
      range: '70 - 129 marks',
      description: 'Eligible for packages up to 5 LPA. Focus on strengthening 1–2 weak checkpoints.',
      benefits: ['Internships', 'Trainee programs', 'Campus roles'],
    },
    {
      name: 'Above 5 to Below 10 LPA',
      color: 'amber',
      icon: Star,
      range: '130 - 259 marks',
      description: 'On track for 5–10 LPA offers. Targeted improvements can push you to 10 LPA+.',
      benefits: ['Graduate engineer roles', 'Developer positions', 'Consulting and analyst roles'],
    },
    {
      name: 'Above 10 LPA',
      color: 'green',
      icon: CheckCircle,
      range: '260+ marks',
      description: 'You meet the criteria for premium offers above 10 LPA.',
      benefits: ['Top product roles', 'Fast-track leadership programs', 'High-impact projects'],
    },
  ]

  const getTierColor = (color) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          glow: 'shadow-lg shadow-red-100',
          gradient: 'from-red-500 to-red-600',
          text: 'text-red-700',
          iconText: 'text-red-600',
          iconBg: 'bg-red-100',
        }
      case 'amber':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          glow: 'shadow-lg shadow-amber-100',
          gradient: 'from-amber-500 to-amber-600',
          text: 'text-amber-700',
          iconText: 'text-amber-600',
          iconBg: 'bg-amber-100',
        }
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          glow: 'shadow-lg shadow-green-100',
          gradient: 'from-green-500 to-green-600',
          text: 'text-green-700',
          iconText: 'text-green-600',
          iconBg: 'bg-green-100',
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
      <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Eligibility Status</h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              whileHover={isCurrentTier ? { scale: 1.02, y: -5 } : { scale: 1.01 }}
              className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${isCurrentTier ? `${colors.bg} ${colors.border} ${colors.glow}` : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm opacity-70 hover:opacity-100'}`}
            >
              {/* Subtle background gradient for current tier */}
              {isCurrentTier && (
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full blur-2xl -mr-10 -mt-10`}></div>
              )}

              <div className="relative z-10 space-y-5">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`p-3 rounded-xl shadow-sm ${isCurrentTier ? colors.iconBg : 'bg-slate-100'}`}
                  >
                    <Icon className={isCurrentTier ? colors.iconText : 'text-slate-400'} size={28} />
                  </motion.div>

                  {isCurrentTier && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] uppercase tracking-wider font-extrabold text-white shadow-sm"
                    >
                      Current Tier
                    </motion.div>
                  )}
                </div>

                {/* Tier Name */}
                <div>
                  <h3 className={`text-xl font-black mb-1 tracking-tight ${isCurrentTier ? colors.text : 'text-slate-700'}`}>{tier.name}</h3>
                  <p className={`font-semibold text-xs uppercase tracking-widest ${isCurrentTier ? colors.text : 'text-slate-400'}`}>{tier.range}</p>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed font-medium ${isCurrentTier ? 'text-slate-800' : 'text-slate-500'}`}>{tier.description}</p>

                {/* Benefits */}
                <div className={`space-y-3 pt-5 border-t ${isCurrentTier ? colors.border : 'border-slate-100'}`}>
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${isCurrentTier ? colors.text : 'text-slate-400'}`}>Eligible for:</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, benefitIdx) => (
                      <motion.li
                        key={benefitIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + idx * 0.15 + benefitIdx * 0.05 }}
                        className={`text-sm flex items-start gap-2 font-medium ${isCurrentTier ? 'text-slate-700' : 'text-slate-500'}`}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ delay: 1 + idx * 0.15 + benefitIdx * 0.1, duration: 1.5 }}
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isCurrentTier ? colors.bg.replace('bg-', 'bg-').replace('-50', '-500') : 'bg-slate-300'}`}
                        ></motion.div>
                        <span className="leading-snug">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default EligibilityCards
