import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token and user info
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.full_name)
        localStorage.setItem('userId', data.user.user_id)
        localStorage.setItem('isAuthenticated', 'true')
        
        // Dispatch event to notify App.jsx of auth change
        window.dispatchEvent(new Event('authChanged'))
        
        navigate('/user-dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          full_name: registerName.trim() || email.split('@')[0],
        }),
      })

      const data = await response.json()

      if (data.success) {
        setError('')
        // Automatically log in after registration
        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        })

        const loginData = await loginResponse.json()
        if (loginData.success) {
          localStorage.setItem('authToken', loginData.token)
          localStorage.setItem('userEmail', loginData.user.email)
          localStorage.setItem('userName', loginData.user.full_name)
          localStorage.setItem('userId', loginData.user.user_id)
          localStorage.setItem('isAuthenticated', 'true')
          window.dispatchEvent(new Event('authChanged'))
          navigate('/user-dashboard')
        }
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
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
        className="relative z-10 w-full max-w-md px-4"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10"
        >
          {/* Logo/Title */}
          <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8 flex flex-col items-center">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-full text-blue-700 mb-3 sm:mb-4 shadow-sm">
              <BookOpen size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-1 sm:mb-2 tracking-tight">
              Placement Predictor
            </h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm">
              {isRegistering ? 'Create your account' : 'Sign in to your account'}
            </p>
          </motion.div>

          {/* Login/Register form */}
          <motion.form 
            onSubmit={isRegistering ? handleRegister : handleLogin} 
            variants={itemVariants} 
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Full Name input (only for registration) */}
            {isRegistering && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">Full Name</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 min-h-[44px] bg-slate-50 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>
            )}

            {/* Email input */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 min-h-[44px] bg-slate-50 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 min-h-[44px] bg-slate-50 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
              {isRegistering && (
                <p className="text-xs text-slate-500 mt-1.5">At least 6 characters</p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Sign in/Register button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3.5 px-4 min-h-[44px] bg-blue-800 text-white font-bold text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-blue-900/20 hover:bg-blue-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isRegistering ? 'Creating account...' : 'Authenticating...') : (isRegistering ? 'Create Account' : 'Sign In')}
            </motion.button>
          </motion.form>

          {/* Toggle between login and register */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-slate-600 font-medium text-sm">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError('')
                  setEmail('')
                  setPassword('')
                  setRegisterName('')
                }}
                className="text-blue-700 font-bold hover:underline"
              >
                {isRegistering ? 'Sign In' : 'Register'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
