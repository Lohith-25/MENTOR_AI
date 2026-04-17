import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2,
  Zap,
  GitBranch,
  Trophy,
  TrendingUp,
  Briefcase,
  BookOpen,
  Target,
  Loader,
  LogOut,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Info
} from 'lucide-react'
import { usePrediction } from '../context/PredictionContext'
import { predictionAPI } from '../utils/api'
import Rubric2028 from '../components/Rubric2028'
import CertificateUpload from '../components/CertificateUpload'

const steps = [
  { id: 1, title: 'Coding', icon: Code2 },
  { id: 2, title: 'Competitive', icon: Trophy },
  { id: 3, title: 'Skills', icon: Target },
  { id: 4, title: 'Projects & OSS', icon: GitBranch },
  { id: 5, title: 'Certificates', icon: Briefcase },
  { id: 6, title: 'Review', icon: CheckCircle2 },
]

const InputPage = ({ onLogout }) => {
  const navigate = useNavigate()
  const { savePrediction, setLoadingState, setErrorState } = usePrediction()

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const [showRubric, setShowRubric] = useState(false)

  const [formData, setFormData] = useState({
    coding_problems: '',
    leetcode_problems: '',
    open_source: 'Beginner',
    competitions: 'Beginner',
    cp_rating: '1-star',
    projects: 'Beginner',
    aptitude: '',
    skillrank: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [certificateMarks, setCertificateMarks] = useState(0)

  // Field configurations
  const fieldConfigs = {
    coding_problems: {
      label: 'Coding Problems Solved', type: 'number', icon: Code2, placeholder: '0 - 2000', min: 0, max: 2000,
      hint: '• Up to 5 LPA: 250+ (100+ LeetCode, 10 marks)\n• 5-10 LPA: 350+ (150+ LeetCode, 20 marks)\n• 10+ LPA: 600+ (200+ LeetCode, 30 marks)',
    },
    leetcode_problems: {
      label: 'LeetCode Problems', type: 'number', icon: Zap, placeholder: '0 - 3000', min: 0, max: 3000,
      hint: 'Included in Coding Problems count above',
    },
    aptitude: {
      label: 'Aptitude Score (%)', type: 'number', icon: Target, placeholder: '0 - 100', min: 0, max: 100,
      hint: '• Up to 5 LPA: Pass (5 marks)\n• 5-10 LPA: ≥75% (10 marks)\n• 10+ LPA: ≥85% or HackerRank Gold (20 marks)',
    },
    skillrank: {
      label: 'SkillRank Score (Avg %)', type: 'number', icon: BookOpen, placeholder: '0 - 100', min: 0, max: 100,
      hint: '• >70: 5 marks\n• >75: 10 marks\n• >80: 15 marks',
    },
    open_source: {
      label: 'Open Source Contribution', type: 'select', icon: GitBranch, options: ['Beginner', 'Intermediate', 'Advanced'],
      descriptions: {
        'Beginner': '1 Hacktoberfest PR, beginner issue, or GSSOC attempt (5 marks)',
        'Intermediate': '4 PRs, GSSOC/GSoC Contributor badge, or OSS community tag (10 marks)',
        'Advanced': '3+ merged PRs, Top Contributor badge, or 50+ star repo maintainer (20 marks)',
      },
    },
    competitions: {
      label: 'Competition Achievement', type: 'select', icon: Trophy, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      descriptions: {
        'Beginner': 'CodeVita R1, CodeChef Starters, AtCoder A-B (min 2, 5–10 marks each)',
        'Intermediate': 'CodeVita R2, hackathon winner, Top 25–40%, AtCoder A-D (min 2, 10–20 marks each)',
        'Advanced': 'ICPC finalist, Codeforces top 20%, LeetCode top 5%, AlgoUtsav finalist (min 3, 20–30 marks each)',
        'Expert': 'Top-tier achievements in multiple platforms simultaneously',
      },
    },
    cp_rating: {
      label: 'CP Rating (CodeChef / CF / AtCoder)', type: 'select', icon: TrendingUp, options: ['1-star', '2-star', '3-star', '4-star', '5-star', '6-star'],
      descriptions: {
        '1-star': 'CodeChef 1★–2★ / CF Newbie / AtCoder Grey (10 marks)',
        '2-star': 'CodeChef 2★–3★ / CF Pupil / AtCoder Brown (20 marks)',
        '3-star': 'CodeChef 3★+ / CF Specialist / AtCoder Green (30 marks)',
        '4-star': 'CodeChef 4★+ / CF Expert (30 marks)',
        '5-star': 'CodeChef 5★+ / CF Candidate Master (30 marks)',
        '6-star': 'CodeChef 6★+ / CF Master+ (30 marks)',
      },
    },
    projects: {
      label: 'Project Development', type: 'select', icon: Briefcase, options: ['Beginner', 'Intermediate', 'Advanced'],
      descriptions: {
        'Beginner': '3+ Beginner projects: SIH participant, open-source 10+ stars (5 marks each)',
        'Intermediate': '3+ Intermediate: SIH finalist, Devfolio top 10, 20+ star repo (10 marks each)',
        'Advanced': '3+ Advanced: SIH winner, research internship, 50+ star repo (20 marks each)',
      },
    },
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    let isValid = true

    const validateNumber = (field) => {
      const value = formData[field]
      if (value === '' || value === undefined) {
        newErrors[field] = 'Required'
        isValid = false
      } else if (isNaN(parseFloat(value))) {
        newErrors[field] = 'Must be a number'
        isValid = false
      }
    }

    if (step === 1) {
      validateNumber('coding_problems')
      validateNumber('leetcode_problems')
    } else if (step === 3) {
      validateNumber('aptitude')
      validateNumber('skillrank')
    }

    setErrors(newErrors)
    return isValid
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1)
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleCertificatesChange = (certs, marks) => {
    setCertificates(certs)
    setCertificateMarks(marks)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Final validation just in case
    if (!validateStep(1) || !validateStep(3)) {
      setSubmitError('Please fix the errors in previous steps')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setLoadingState(true)

    try {
      const dataToSend = {
        coding_problems: parseFloat(formData.coding_problems),
        leetcode_problems: parseFloat(formData.leetcode_problems),
        open_source: formData.open_source,
        competitions: formData.competitions,
        cp_rating: formData.cp_rating,
        projects: formData.projects,
        aptitude: parseFloat(formData.aptitude),
        skillrank: parseFloat(formData.skillrank),
        certificate_marks: certificateMarks,
        certificates: certificates.map(c => ({
          fileName: c.fileName,
          type: c.type,
          marks: c.marks,
        })),
      }

      console.log('Submitting form data:', dataToSend)
      const result = await predictionAPI.predict(dataToSend)
      console.log('Backend response:', result)

      if (result.success) {
        console.log('Saving prediction to context...')
        savePrediction(result, dataToSend)
        console.log('Navigating to dashboard...')
        navigate('/dashboard')
      } else {
        const errorMsg = result.error || 'Failed to analyze. Please try again.'
        console.error('Prediction failed:', errorMsg)
        setSubmitError(errorMsg)
        setErrorState(errorMsg)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Server error. Please try again.'
      console.error('Submission error:', error)
      console.error('Error details:', errorMessage)
      setSubmitError(errorMessage)
      setErrorState(errorMessage)
    } finally {
      setIsSubmitting(false)
      setLoadingState(false)
    }
  }

  // Variants for step transitions
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  const renderField = (fieldKey) => {
    const field = fieldConfigs[fieldKey]
    const Icon = field.icon

    if (field.type === 'select') {
      const description = field.descriptions?.[formData[fieldKey]]
      return (
        <div key={fieldKey} className="group flex flex-col h-full">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
            <Icon size={14} className="sm:w-4 sm:h-4 text-blue-700 transition-all flex-shrink-0" />
            {field.label}
          </label>
          <select
            name={fieldKey}
            value={formData[fieldKey]}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 min-h-[44px] rounded-lg bg-white border border-slate-300 hover:border-blue-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 text-sm sm:text-base text-slate-900 transition-all duration-300 cursor-pointer appearance-none shadow-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '32px',
            }}
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {description && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed flex-grow">
              {description}
            </p>
          )}
        </div>
      )
    }

    return (
      <div key={fieldKey} className="group flex flex-col h-full">
        <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
          <Icon size={14} className="sm:w-4 sm:h-4 text-blue-700 transition-all flex-shrink-0" />
          {field.label}
        </label>
        <input
          type={field.type}
          name={fieldKey}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          value={formData[fieldKey]}
          onChange={handleInputChange}
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 min-h-[44px] rounded-lg border transition-all duration-300 text-sm sm:text-base text-slate-900 bg-white placeholder-slate-400 shadow-sm ${
            errors[fieldKey]
              ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 hover:border-blue-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100'
          }`}
        />
        {field.hint && (
          <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 whitespace-pre-line leading-relaxed flex-grow">
            {field.hint}
          </p>
        )}
        {errors[fieldKey] && (
          <p className="text-red-500 text-xs mt-1 font-medium">{errors[fieldKey]}</p>
        )}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Coding Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('coding_problems')}
              {renderField('leetcode_problems')}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Competitive Arena</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('competitions')}
              {renderField('cp_rating')}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Skill Assessments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('aptitude')}
              {renderField('skillrank')}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Development & Open Source</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('projects')}
              {renderField('open_source')}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Certifications</h2>
            <CertificateUpload onCertificatesChange={handleCertificatesChange} />
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Information</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Coding Problems:</span>
                <span className="font-semibold text-slate-900">{formData.coding_problems}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">LeetCode Problems:</span>
                <span className="font-semibold text-slate-900">{formData.leetcode_problems}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Aptitude:</span>
                <span className="font-semibold text-slate-900">{formData.aptitude}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">SkillRank:</span>
                <span className="font-semibold text-slate-900">{formData.skillrank}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Competitions:</span>
                <span className="font-semibold text-slate-900">{formData.competitions}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">CP Rating:</span>
                <span className="font-semibold text-slate-900">{formData.cp_rating}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Projects:</span>
                <span className="font-semibold text-slate-900">{formData.projects}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Open Source:</span>
                <span className="font-semibold text-slate-900">{formData.open_source}</span>
              </div>
              <div className="flex justify-between items-center sm:col-span-2 pt-2">
                <span className="text-slate-600">Certificates Added:</span>
                <span className="font-bold text-blue-800">{certificates.length} ({certificateMarks} marks)</span>
              </div>
            </div>
            
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mt-4 font-medium">
                {submitError}
              </div>
            )}
            
            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
              Click submit below to analyze your profile and view your placement prediction dashboard.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-slate-50 relative">
      {/* Subtle light background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-40 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-3 right-3 z-50 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/user-dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-700 rounded-lg shadow-sm transition-all duration-300"
        >
          <Trophy size={18} />
          <span className="text-sm font-semibold hidden sm:block">My Dashboard</span>
        </button>
        {onLogout && (
          <button
            onClick={() => {
              onLogout()
              navigate('/')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 rounded-lg shadow-sm transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold hidden sm:block">Logout</span>
          </button>
        )}
      </div>

      {/* Rubric Toggle Button */}
      <button
        onClick={() => setShowRubric(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-blue-900 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold"
      >
        <Info size={20} className="text-blue-700" />
        <span className="text-sm">View Rubric</span>
      </button>

      <div className="w-full max-w-3xl flex flex-col">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900 tracking-tight">
            Profile Assessment
          </h1>
          <p className="text-slate-500 font-medium tracking-wide text-lg">Step {currentStep} of {steps.length} &bull; {steps[currentStep-1].title}</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex justify-between items-center min-w-[500px]">
            {steps.map((step, idx) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? 'border-blue-700 bg-blue-50 text-blue-700 shadow-[0_0_15px_rgba(29,78,216,0.3)] scale-110' :
                    isCompleted ? 'border-blue-900 bg-blue-900 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
                  </div>
                  {/* Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div className={`absolute top-5 left-[50%] right-[-50%] h-[2px] -z-10 transition-all duration-500 ${
                      isCompleted ? 'bg-blue-900' : 'bg-slate-200'
                    }`} />
                  )}
                  <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-blue-800' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative min-h-[400px]">
          {/* Main Content Area */}
          <div className="flex-grow p-8 overflow-hidden relative">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full h-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation Ribbon */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-2xl">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                currentStep === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 hover:text-slate-900'
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-950 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader size={18} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><CheckCircle2 size={18} /> Submit Assessment</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rubric Modal */}
      <AnimatePresence>
        {showRubric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowRubric(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border text-slate-900 border-slate-200 rounded-2xl p-1 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 right-0 flex justify-end p-2 pb-0 z-10 bg-white/90 backdrop-blur-md">
                <button 
                  onClick={() => setShowRubric(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 pt-0 text-slate-800">
                <Rubric2028 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}

export default InputPage
