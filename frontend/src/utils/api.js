import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const predictionAPI = {
  /**
   * Send form data to backend for prediction
   */
  predict: async (formData) => {
    try {
      const response = await api.post('/api/predict', formData)
      return response.data
    } catch (error) {
      console.error('Prediction error:', error)
      throw error
    }
  },

  /**
   * Get prediction history
   */
  getHistory: async (limit = 10) => {
    try {
      const response = await api.get('/api/predictions/history', {
        params: { limit },
      })
      return response.data
    } catch (error) {
      console.error('History error:', error)
      throw error
    }
  },

  /**
   * Get specific prediction by ID
   */
  getPredictionById: async (id) => {
    try {
      const response = await api.get(`/api/predictions/${id}`)
      return response.data
    } catch (error) {
      console.error('Get prediction error:', error)
      throw error
    }
  },

  /**
   * Get category definitions
   */
  getCategories: async () => {
    try {
      const response = await api.get('/api/categories')
      return response.data
    } catch (error) {
      console.error('Categories error:', error)
      throw error
    }
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      return { status: 'unhealthy' }
    }
  },

  /**
   * User dashboard tasks & streaks
   */
  getTasks: async (email) => {
    try {
      const response = await api.get('/api/tasks', { params: { email } })
      return response.data
    } catch (error) {
      console.error('Task fetch error', error)
      throw error
    }
  },

  toggleTask: async (taskId) => {
    try {
      const response = await api.post('/api/tasks/toggle', { task_id: taskId })
      return response.data
    } catch (error) {
      console.error('Task toggle error', error)
      throw error
    }
  },

  getAIGuide: async (email) => {
    try {
      const response = await api.post('/api/ai/guide', { email })
      return response.data
    } catch (error) {
      console.error('AI Guide error', error)
      throw error
    }
  }
}

export default api
