import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    // Demo credentials validation
    if (email === 'user@example.com' && password === 'password123') {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email)
        // Dispatch event to notify App.jsx of auth change
        window.dispatchEvent(new Event('authChanged'))
        navigate('/user-dashboard')
      }, 1000)
    } else {
      setError('Invalid email or password')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden flex items-center justify-center">
      {/* Animated background subtle decorations */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

      {/* Main login card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10 mx-4 md:mx-0"
        >
          {/* Logo/Title */}
          <motion.div variants={itemVariants} className="text-center mb-8 flex flex-col items-center">
            <div className="p-3 bg-blue-50 rounded-full text-blue-700 mb-4 shadow-sm">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">
              Placement Predictor
            </h1>
            <p className="text-slate-500 font-medium text-sm">Sign in to begin your assessment</p>
          </motion.div>

          {/* Login form */}
          <motion.form onSubmit={handleLogin} variants={itemVariants} className="space-y-6">
            {/* Email input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Sign in button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-800 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-900/20 hover:bg-blue-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Demo credentials hint */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-bold text-slate-500 text-center mb-3 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email:</span>
                <code className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">user@example.com</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Password:</span>
                <code className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">password123</code>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
