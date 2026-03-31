import React, { createContext, useState, useContext } from 'react'

const PredictionContext = createContext()

export const PredictionProvider = ({ children }) => {
  const [predictionResult, setPredictionResult] = useState(null)
  const [formData, setFormData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const savePrediction = (result, form) => {
    setPredictionResult(result)
    setFormData(form)
    setError(null)
  }

  const clearPrediction = () => {
    setPredictionResult(null)
    setFormData(null)
    setError(null)
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
