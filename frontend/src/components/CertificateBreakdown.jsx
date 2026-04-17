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
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-extrabold text-blue-900 tracking-tight">Certificate Contributions</h3>
        <div className="px-4 py-1.5 bg-green-50 border border-green-200 rounded-full shadow-sm">
          <p className="text-sm font-bold text-green-700">+{certificateMarks} marks</p>
        </div>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 rounded-xl overflow-hidden transition-all duration-300"
          >
            <div className="relative p-6 space-y-5">
              {/* Header with icon and name */}
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={18} className="text-amber-500" />
                    <h4 className="font-bold text-slate-800">{cert.type}</h4>
                  </div>
                  <p className="text-xs font-medium text-slate-500 truncate">{cert.fileName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-black text-green-600 flex items-center justify-end gap-1">
                    <Check size={18} strokeWidth={3} />
                    {cert.marks}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">marks</p>
                </div>
              </div>

              {/* Visual indicator */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-green-500"
                  style={{ width: '100%' }}
                ></div>
              </div>

              {/* Certificate info */}
              <p className="text-xs font-semibold text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded">
                Certificate successfully scored
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-5 rounded-r-xl rounded-l-md shadow-sm"
      >
        <p className="text-sm font-medium text-amber-900">
          <span className="font-bold">Total Certificate Contribution:</span> +{certificateMarks} marks added toward your placement eligibility score.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default CertificateBreakdown
