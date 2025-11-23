import axios from 'axios'
import { getAuthHeaders, removeToken } from './auth'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password })
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

export const googleLogin = async (token) => {
  const response = await api.post('/api/auth/google', { token })
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/api/auth/me', {
    headers: getAuthHeaders(),
  })
  return response.data
}

// Chat
export const sendMessage = async (notebookId, message, personaId = null, language = 'en') => {
  const response = await api.post('/api/chat/message', {
    notebookId,
    message,
    personaId,
    language,
  }, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getChatHistory = async (notebookId, limit = 50, skip = 0) => {
  const response = await api.get(`/api/chat/history/${notebookId}`, {
    params: { limit, skip },
    headers: getAuthHeaders(),
  })
  return response.data
}

export const createNotebook = async (title = 'New Travel Chat') => {
  const response = await api.post('/api/chat/notebooks', { title }, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getNotebooks = async () => {
  const response = await api.get('/api/chat/notebooks', {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const deleteNotebook = async (notebookId) => {
  const response = await api.delete(`/api/chat/notebooks/${notebookId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

// Personas
export const getAllPersonas = async () => {
  const response = await api.get('/api/personas')
  return response.data
}

export const getPersona = async (personaId) => {
  const response = await api.get(`/api/personas/${personaId}`)
  return response.data
}

export const setPreferredPersona = async (personaId) => {
  const response = await api.post('/api/personas/preferred', { personaId }, {
    headers: getAuthHeaders(),
  })
  return response.data
}

// Travel
export const searchSites = async (query, state, category) => {
  const response = await api.get('/api/travel/sites', {
    params: { query, state, category },
  })
  return response.data
}

export const searchTreks = async (query, difficulty, state, maxAltitude) => {
  const response = await api.get('/api/travel/treks', {
    params: { query, difficulty, state, maxAltitude },
  })
  return response.data
}

export const searchHomestays = async (state, category, ecoRating) => {
  const response = await api.get('/api/travel/homestays', {
    params: { state, category, ecoRating },
  })
  return response.data
}

export const searchFestivals = async (month, state, category) => {
  const response = await api.get('/api/travel/festivals', {
    params: { month, state, category },
  })
  return response.data
}

export const getCrowdPrediction = async (locationId, date) => {
  const response = await api.get('/api/travel/crowd/predict', {
    params: { locationId, date },
  })
  return response.data
}

export const getBestTimes = async (locationId) => {
  const response = await api.get('/api/travel/crowd/best-times', {
    params: { locationId },
  })
  return response.data
}

// Wellness
export const getWellnessRoutines = async () => {
  const response = await api.get('/api/wellness/routines')
  return response.data
}

export const getWellnessRoutine = async (routineId) => {
  const response = await api.get(`/api/wellness/routines/${routineId}`)
  return response.data
}

export const startWellnessSession = async (routineId, routineName, sessionType, duration, moodBefore) => {
  const response = await api.post('/api/wellness/sessions', {
    routineId,
    routineName,
    sessionType,
    duration,
    moodBefore,
  }, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const completeWellnessSession = async (sessionId, moodAfter, notes, postureDetection) => {
  const response = await api.put(`/api/wellness/sessions/${sessionId}/complete`, {
    moodAfter,
    notes,
    postureDetection,
  }, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getShlokas = async (category) => {
  const response = await api.get('/api/wellness/shlokas', {
    params: { category },
  })
  return response.data
}

// Sustainability
export const calculateCarbon = async (travelMode, distanceKm, accommodationType, durationDays) => {
  const response = await api.post('/api/sustainability/carbon/calculate', {
    travelMode,
    distanceKm,
    accommodationType,
    durationDays,
  })
  return response.data
}

export const compareTransport = async (distanceKm) => {
  const response = await api.get('/api/sustainability/carbon/compare', {
    params: { distanceKm },
  })
  return response.data
}

export const getEcoTips = async (category, context) => {
  const response = await api.get('/api/sustainability/tips', {
    params: { category, context },
  })
  return response.data
}

export const getEcoHomestays = async (minEcoRating, state) => {
  const response = await api.get('/api/sustainability/homestays', {
    params: { minEcoRating, state },
  })
  return response.data
}

// Itinerary
export const createTripPlan = async (title, destinations, startDate, endDate, preferences) => {
  const response = await api.post('/api/itinerary', {
    title,
    destinations,
    startDate,
    endDate,
    preferences,
  }, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getTripPlans = async (status) => {
  const response = await api.get('/api/itinerary', {
    params: { status },
    headers: getAuthHeaders(),
  })
  return response.data
}
