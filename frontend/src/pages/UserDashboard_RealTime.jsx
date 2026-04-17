import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, Circle, Flame, Target, Sparkles, BookOpen, LogOut, Loader, ArrowRight, 
  Award, Calendar, Zap, TrendingUp, User, Trophy, TrendingDown, AlertCircle, Bell, Volume2, VolumeX,
  Clock, Lightbulb, Activity, BarChart3
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts'

// Real-time hooks
const useRealTimeDashboard = (userId) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    // Simulated Socket.IO for now - will connect to real backend
    const initSocket = () => {
      // socket.io initialization would go here
      setSocketConnected(true)
    }

    // Fetch initial data
    const fetchDashboard = async () => {
      try {
        // Would call actual API
        const mockData = {
          tasks: [
            { id: 1, title: 'Complete LeetCode easy problems', completed: true, priority: 'High', createdAt: new Date() },
            { id: 2, title: 'Review system design concepts', completed: true, priority: 'High', createdAt: new Date() },
            { id: 3, title: 'Practice coding interview', completed: false, priority: 'Medium', createdAt: new Date() },
            { id: 4, title: 'Study data structures', completed: false, priority: 'Medium', createdAt: new Date() },
          ],
          streak: 8,
          progress: { completed: 2, total: 4, percentage: 50 },
          successRate: 85,
          level: 'Pro',
          xp: 2450,
          chartData: [
            { date: 'Mon', completed: 3, target: 5 },
            { date: 'Tue', completed: 4, target: 5 },
            { date: 'Wed', completed: 5, target: 5 },
            { date: 'Thu', completed: 2, target: 5 },
            { date: 'Fri', completed: 4, target: 5 },
            { date: 'Sat', completed: 3, target: 5 },
            { date: 'Sun', completed: 2, target: 5 },
          ],
          weeklyActivity: [
            { day: 'Mon', active: true, tasks: 3 },
            { day: 'Tue', active: true, tasks: 4 },
            { day: 'Wed', active: true, tasks: 5 },
            { day: 'Thu', active: false, tasks: 2 },
            { day: 'Fri', active: true, tasks: 4 },
            { day: 'Sat', active: true, tasks: 3 },
            { day: 'Sun', active: false, tasks: 2 },
          ],
          aiInsights: [
            { title: 'Peak Productivity', description: 'You\'re most productive on Wed & Thu', icon: '⚡', color: 'blue' },
            { title: 'Consistency Drop', description: 'Your consistency dropped 20% this week', icon: '📉', color: 'orange' },
            { title: 'Strong Start', description: 'Great morning session productivity detected', icon: '🌅', color: 'green' },
          ],
        }
        setDashboardData(mockData)
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
      }
    }

    initSocket()
    fetchDashboard()
  }, [userId])

  return { dashboardData, socketConnected }
}

export default function UserDashboard({ onLogout }) {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId') || 'user123'
  const userName = localStorage.getItem('userName') || 'Developer'
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
  
  const { dashboardData, socketConnected } = useRealTimeDashboard(userId)
  const [notifications, setNotifications] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loading, setLoading] = useState(!dashboardData)

  // Add notification toast
  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }, [])

  // Play sound effect
  const playSuccessSound = useCallback(() => {
    if (!soundEnabled) return
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const osc1 = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(audioContext.destination)
    
    osc1.frequency.value = 800
    osc2.frequency.value = 600
    osc1.type = 'sine'
    osc2.type = 'sine'
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    osc1.start(audioContext.currentTime)
    osc2.start(audioContext.currentTime)
    osc1.stop(audioContext.currentTime + 0.2)
    osc2.stop(audioContext.currentTime + 0.2)
  }, [soundEnabled])

  // Handle task toggle
  const handleTaskToggle = useCallback((taskId) => {
    playSuccessSound()
    addNotification('Task completed! 🎉', 'success')
  }, [playSuccessSound, addNotification])

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
          />
          <p className="text-white font-semibold text-lg">Loading AI Dashboard</p>
          <p className="text-slate-400 text-sm mt-2">{socketConnected ? '🟢 Connected' : '🔴 Connecting...'}</p>
        </motion.div>
      </div>
    )
  }

  const { tasks, streak, progress, successRate, level, xp, chartData, weeklyActivity, aiInsights } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className={`backdrop-blur-xl rounded-lg p-4 border ${
              notif.type === 'success' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              <p className="font-semibold">{notif.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <nav className="backdrop-blur-md bg-slate-900/40 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mentor AI</h1>
                <p className="text-xs text-slate-400">Real-Time Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {socketConnected && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs text-green-400 font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              )}
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button 
                onClick={() => {
                  localStorage.clear()
                  onLogout?.()
                  navigate('/')
                }}
                className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Profile Card */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:border-slate-600/50 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {userName[0].toUpperCase()}
                </div>
                <div>
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
                    🎓 Welcome back
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-1">{userName}</h2>
                  <p className="text-slate-400 text-sm">{userEmail}</p>
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-slate-400">Level: <span className="text-yellow-400 font-bold">{level}</span></span>
                    <span className="text-slate-400">XP: <span className="text-purple-400 font-bold">{xp}</span></span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs uppercase tracking-wide">Status</p>
                <p className="text-2xl font-bold text-green-400">🟢 Active</p>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-center items-center hover:border-orange-500/50 transition-all"
          >
            <div className="p-4 bg-orange-500/20 rounded-full mb-3">
              <Flame size={40} className="text-orange-400" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Streak</p>
            <p className="text-5xl font-black text-orange-400">{streak}</p>
            <p className="text-slate-400 text-sm">Days active</p>
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target size={22} className="text-blue-400" />
                  Today's Progress
                </h3>
                <span className="text-sm font-bold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                  {progress.completed}/{progress.total}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-400 min-w-fit">{progress.percentage}%</span>
                </div>
                <p className="text-xs text-slate-400">Updates in real-time</p>
              </div>
            </motion.div>

            {/* Performance Charts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={22} className="text-cyan-400" />
                Weekly Performance
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="target" stroke="#06b6d4" strokeWidth={2} name="Target" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Tasks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50 bg-slate-900/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={22} className="text-green-400" />
                  Tasks ({tasks.filter(t => t.completed).length}/{tasks.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-700/50">
                {tasks.map((task, idx) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 hover:bg-slate-700/30 transition-colors group flex items-center gap-4"
                  >
                    <button 
                      onClick={() => handleTaskToggle(task.id)}
                      className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={24} className="text-green-500 drop-shadow-lg" />
                      ) : (
                        <Circle size={24} className="text-slate-500 group-hover:text-blue-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* AI Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb size={22} className="text-yellow-400" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                    <p className="text-xs text-slate-400">{insight.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Real-time Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid gap-3"
            >
              <div className="backdrop-blur-xl bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 rounded-xl p-4 shadow-xl">
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Success Rate</p>
                <p className="text-3xl font-black text-blue-400">{successRate}%</p>
              </div>
              <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/30 rounded-xl p-4 shadow-xl">
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Active Days</p>
                <p className="text-3xl font-black text-purple-400">{weeklyActivity.filter(d => d.active).length}/7</p>
              </div>
              <div className="backdrop-blur-xl bg-gradient-to-br from-green-900/40 to-slate-900/40 border border-green-500/30 rounded-xl p-4 shadow-xl">
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Level</p>
                <p className="text-3xl font-black text-green-400">{level}</p>
              </div>
            </motion.div>

            {/* Weekly Heatmap */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={22} className="text-green-400" />
                Weekly Activity
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {weeklyActivity.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs font-bold text-slate-500 mb-1">{day.day}</p>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-full h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        day.active
                          ? 'bg-gradient-to-br from-green-500/40 to-emerald-600/40 border-green-500/50 text-green-400 shadow-lg shadow-green-500/20'
                          : 'bg-slate-700/30 border-slate-600/50 text-slate-500'
                      }`}
                    >
                      {day.tasks}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
