import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Flame, Target, Sparkles, BookOpen, LogOut, Loader, ArrowRight } from 'lucide-react'
import { predictionAPI } from '../utils/api'

export default function UserDashboard({ onLogout }) {
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail') || 'user@example.com'
  
  const [tasks, setTasks] = useState([])
  const [streak, setStreak] = useState(0)
  const [aiGuide, setAiGuide] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, aiRes] = await Promise.all([
          predictionAPI.getTasks(email),
          predictionAPI.getAIGuide(email)
        ])
        
        if (taskRes.success) {
          setStreak(taskRes.data.streak)
          setTasks(taskRes.data.tasks)
        }
        
        if (aiRes.success) {
          setAiGuide(aiRes.guide)
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [email])

  const handleToggleTask = async (taskId) => {
    // Optimistically update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
    
    try {
      await predictionAPI.toggleTask(taskId)
      // Refetch to get updated streak if it changed
      const taskRes = await predictionAPI.getTasks(email)
      if (taskRes.success) {
         setStreak(taskRes.data.streak)
         setTasks(taskRes.data.tasks)
      }
    } catch (err) {
      console.error("Failed to toggle task", err)
      // Revert optimistically
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-blue-700">
          <Loader size={32} className="animate-spin mb-4" />
          <p className="font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progressText = totalCount === 0 ? "0%" : `${Math.round((completedCount/totalCount)*100)}%`

  return (
    <div className="min-h-screen w-full bg-slate-50 relative pb-12">
      <div className="absolute top-0 w-full h-80 bg-blue-900 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Navbar area */}
        <div className="flex items-center justify-between mb-8 text-white">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Target size={24} />
             </div>
             <h1 className="text-2xl font-bold tracking-tight">Mentor AI Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
               onClick={() => navigate('/dashboard')}
               className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/20 backdrop-blur-sm mr-2"
            >
              View Final Review
            </button>
            <button 
               onClick={() => navigate('/predictor')}
               className="text-sm font-semibold hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/20 backdrop-blur-sm"
            >
              Update Predictor
            </button>
            {onLogout && (
              <button
                onClick={() => {
                  onLogout()
                  navigate('/')
                }}
                className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Overlapping Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Streak & Progress Highlight */}
            <motion.div 
               initial={{opacity: 0, y: 20}}
               animate={{opacity: 1, y: 0}}
               className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6"
            >
               <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${streak > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                     <Flame size={32} className={streak > 0 ? "animate-pulse" : ""} />
                  </div>
                  <div>
                     <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Current Streak</p>
                     <p className="text-3xl font-black text-slate-800">{streak} <span className="text-lg font-medium text-slate-500">Days</span></p>
                  </div>
               </div>

               <div className="flex-grow w-full sm:w-auto px-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0">
                  <div className="flex justify-between items-center mb-2">
                     <p className="text-sm font-bold text-slate-700">Today's Progress</p>
                     <span className="text-sm font-bold text-blue-700">{completedCount}/{totalCount} completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{width: 0}}
                        animate={{width: progressText}}
                        className="bg-blue-600 h-full rounded-full"
                        transition={{duration: 0.5}}
                     ></motion.div>
                  </div>
               </div>
            </motion.div>

            {/* Daily Tasks */}
            <motion.div 
               initial={{opacity: 0, y: 20}}
               animate={{opacity: 1, y: 0}}
               transition={{delay: 0.1}}
               className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
            >
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <BookOpen size={20} className="text-blue-700" />
                     Your Daily Tasks
                  </h2>
               </div>
               
               <div className="divide-y divide-slate-100">
                  {tasks.length > 0 ? tasks.map((task) => (
                     <div key={task.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                        <button 
                           onClick={() => handleToggleTask(task.id)}
                           className="flex-shrink-0 focus:outline-none focus:scale-110 transition-transform"
                        >
                           {task.completed ? (
                              <CheckCircle2 size={28} className="text-green-500 shadow-sm transition-all" />
                           ) : (
                              <Circle size={28} className="text-slate-300 group-hover:text-blue-400 transition-all" />
                           )}
                        </button>
                        <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                           {task.title}
                        </p>
                     </div>
                  )) : (
                     <div className="p-8 text-center text-slate-500 font-medium">
                        No tasks available for today. Click update predictor to refresh.
                     </div>
                  )}
               </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* AI Guide Card */}
            <motion.div 
               initial={{opacity: 0, y: 20}}
               animate={{opacity: 1, y: 0}}
               transition={{delay: 0.2}}
               className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-xl overflow-hidden text-white border border-indigo-800 relative"
            >
               <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                  <Sparkles size={80} />
               </div>
               <div className="p-6 relative z-10">
                  <div className="flex items-center gap-2 text-indigo-200 font-bold uppercase tracking-wider text-xs mb-4">
                     <Sparkles size={16} />
                     AI Guide
                  </div>
                  <h3 className="text-lg font-semibold leading-relaxed mb-6">
                     {aiGuide || "Keep uploading your resume to let AI guide you based on your target package!"}
                  </h3>
                  <button 
                     onClick={() => navigate('/predictor')}
                     className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg flex items-center justify-center gap-2 font-semibold text-sm backdrop-blur-sm"
                  >
                     Run Assessment <ArrowRight size={16} />
                  </button>
               </div>
            </motion.div>

            {/* Quick Stats or Tips */}
            <motion.div 
               initial={{opacity: 0, y: 20}}
               animate={{opacity: 1, y: 0}}
               transition={{delay: 0.3}}
               className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
            >
               <h3 className="font-bold text-slate-800 mb-4">Why Streaks Matter</h3>
               <p className="text-sm text-slate-600 leading-relaxed">
                  Completing your tasks daily builds the crucial habits needed for technical interviews. Companies value consistent contributors over sporadic burst-learners. Keep the flame alive!
               </p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
