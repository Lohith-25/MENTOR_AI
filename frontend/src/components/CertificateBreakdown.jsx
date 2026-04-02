import React from 'react'
import { motion } from 'framer-motion'
import { Award, Check } from 'lucide-react'

const CertificateBreakdown = ({ certificateMarks, certificates }) => {
  if (!certificates || certificates.length === 0) {
    return null
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
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-100">Certificate Contributions</h3>
        <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-sm font-semibold text-green-300">+{certificateMarks} marks</p>
        </div>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group glass hover-lift overflow-hidden"
          >
            {/* Card background animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-6 space-y-4">
              {/* Header with icon and name */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={20} className="text-amber-400" />
                    <h4 className="font-semibold text-slate-200">{cert.type}</h4>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{cert.fileName}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400 flex items-center gap-1">
                    <Check size={16} />
                    {cert.marks}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">marks</p>
                </div>
              </div>

              {/* Visual indicator */}
              <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-green-500"
                  style={{ width: '100%' }}
                ></div>
              </div>

              {/* Certificate info */}
              <p className="text-xs text-slate-500">Certificate successfully uploaded</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-lg p-4 border-l-4 border-amber-500"
      >
        <p className="text-sm text-slate-300">
          <span className="font-semibold">Total Certificate Contribution:</span> +{certificateMarks} marks toward your eligibility score
        </p>
      </motion.div>
    </motion.div>
  )
}

export default CertificateBreakdown
