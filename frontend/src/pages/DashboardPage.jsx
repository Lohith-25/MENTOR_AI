import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle, LogOut, Home } from 'lucide-react'
import { usePrediction } from '../context/PredictionContext'
import ScoreCard from '../components/ScoreCard'
import MetricsGrid from '../components/MetricsGrid'
import AnalyticsSection from '../components/AnalyticsSection'
import SuggestionsCard from '../components/SuggestionsCard'
import EligibilityCards from '../components/EligibilityCards'
import CertificateBreakdown from '../components/CertificateBreakdown'
import Rubric2028 from '../components/Rubric2028'
import Confetti from '../components/Confetti'

const DashboardPage = ({ onLogout }) => {
  const navigate = useNavigate()
  const { predictionResult } = usePrediction()
  const [isConfetti, setIsConfetti] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Trigger confetti for top tier
    if (predictionResult?.eligibility?.color === 'green') {
      setIsConfetti(true)
    }
    setLoading(false)
  }, [predictionResult])

  // Debug logging
  useEffect(() => {
    console.log('DashboardPage - predictionResult:', predictionResult)
  }, [predictionResult])

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full"
        />
      </div>
    )
  }

  if (!predictionResult) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Prediction Yet</h2>
            <p className="text-slate-600 mb-6">
              Please fill out the eligibility form first to see your placement prediction and analysis.
            </p>
            <motion.button
              onClick={() => navigate('/predictor')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all"
            >
              Go to Form
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const { total_score, max_possible_score, eligibility, category_breakdown, suggestions, certificate_marks, certificates } = predictionResult

  // Validate required data
  if (!eligibility || !category_breakdown || !suggestions) {
    console.error('Missing required data:', { eligibility, category_breakdown, suggestions })
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-slate-600 mb-6">
              The prediction data is incomplete. Please try submitting the form again.
            </p>
            <motion.button
              onClick={() => navigate('/predictor')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all"
            >
              Go Back to Form
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.320, 1] },
    },
  }

  return (
    <div className="min-h-screen w-full pb-12 bg-slate-50 relative">
      {/* Confetti animation for top tier */}
      {isConfetti && <Confetti />}

      {/* Animated background subtle decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Back Button */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">
              Placement Eligibility Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">Your Performance Analysis & Package Prediction</p>
          </div>
          <motion.div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/user-dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 border border-blue-700 text-white hover:bg-blue-800 shadow-sm transition-all font-semibold"
            >
              <Home size={20} />
              <span className="hidden sm:inline">My Dashboard</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/predictor')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 shadow-sm transition-all font-semibold"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Re-Assess</span>
            </motion.button>
            {onLogout && (
              <motion.button
                onClick={() => {
                  onLogout()
                  navigate('/')
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-sm transition-all font-semibold"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Main Score Card - Center Focused */}
        <motion.div variants={itemVariants}>
          <ScoreCard
            totalScore={total_score}
            maxScore={max_possible_score}
            eligibility={eligibility}
          />
        </motion.div>

        {/* Performance Metrics Grid */}
        <motion.div variants={itemVariants}>
          <MetricsGrid categoryBreakdown={category_breakdown} />
        </motion.div>

        {/* Certificate Breakdown - if certificates exist */}
        {certificates && certificates.length > 0 && (
          <motion.div variants={itemVariants}>
            <CertificateBreakdown 
              certificateMarks={certificate_marks || 0} 
              certificates={certificates} 
            />
          </motion.div>
        )}

        {/* Analytics Section */}
        <motion.div variants={itemVariants}>
          <AnalyticsSection categoryBreakdown={category_breakdown} />
        </motion.div>

        {/* AI Suggestions Card */}
        <motion.div variants={itemVariants}>
          <SuggestionsCard suggestions={suggestions} />
        </motion.div>

        {/* Final Review & Rubric Breakdown */}
        <motion.div variants={itemVariants} className="pt-8 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-blue-900">Final Review & Rubric Breakdown</h2>
            <p className="text-slate-500 font-medium">Detailed analysis of your assessment points based on the 2028 batch criteria.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
            <Rubric2028 />
          </div>
        </motion.div>

        {/* Eligibility Status Cards */}
        <motion.div variants={itemVariants}>
          <EligibilityCards currentTier={eligibility.tier} />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center text-blue-900 font-medium text-sm shadow-sm"
        >
          <p>
            💡 <span className="font-bold">Pro Tip:</span> Use the suggestions above to improve your score and compete for higher placement packages.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
