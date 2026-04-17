import React, { createContext, useState, useContext, useEffect } from 'react'

const PredictionContext = createContext()

// Helper function to load from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const PredictionProvider = ({ children }) => {
  // Initialize from localStorage immediately
  const [predictionResult, setPredictionResult] = useState(() => 
    loadFromLocalStorage('predictionResult', null)
  )
  const [formData, setFormData] = useState(() =>
    loadFromLocalStorage('formData', null)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const savePrediction = (result, form) => {
    setPredictionResult(result)
    setFormData(form)
    setError(null)
    // Persist to localStorage
    localStorage.setItem('predictionResult', JSON.stringify(result))
    localStorage.setItem('formData', JSON.stringify(form))
    console.log('Prediction saved to context and localStorage:', result)
  }

  const clearPrediction = () => {
    setPredictionResult(null)
    setFormData(null)
    setError(null)
    localStorage.removeItem('predictionResult')
    localStorage.removeItem('formData')
  }

  const setLoadingState = (loading) => {
    setIsLoading(loading)
  }

  const setErrorState = (err) => {
    setError(err)
  }

  return (
    <PredictionContext.Provider
      value={{
        predictionResult,
        formData,
        isLoading,
        error,
        savePrediction,
        clearPrediction,
        setLoadingState,
        setErrorState,
      }}
    >
      {children}
    </PredictionContext.Provider>
  )
}

export const usePrediction = () => {
  const context = useContext(PredictionContext)
  if (!context) {
    throw new Error('usePrediction must be used within PredictionProvider')
  }
  return context
}
