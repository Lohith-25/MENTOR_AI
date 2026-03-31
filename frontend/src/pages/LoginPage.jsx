import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
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
        navigate('/predictor')
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      {/* Main login card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10"
        >
          {/* Logo/Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Placement Predictor
            </h1>
            <p className="text-gray-300 text-sm">Sign in to check your eligibility</p>
          </motion.div>

          {/* Login form */}
          <motion.form onSubmit={handleLogin} variants={itemVariants} className="space-y-6">
            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                required
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
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
                className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm"
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
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Demo credentials hint */}
          <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded border border-white/10">
                <span className="text-gray-300">Email:</span>
                <code className="text-blue-300 font-mono">user@example.com</code>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded border border-white/10">
                <span className="text-gray-300">Password:</span>
                <code className="text-blue-300 font-mono">password123</code>
              </div>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p variants={itemVariants} className="text-center text-xs text-gray-400 mt-8">
            This is a demo login. Use the credentials above.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
