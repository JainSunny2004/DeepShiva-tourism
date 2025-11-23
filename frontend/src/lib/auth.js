import { jwtDecode } from 'jwt-decode'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    
    if (decoded.exp < currentTime) {
      removeToken()
      return false
    }
    
    return true
  } catch (error) {
    removeToken()
    return false
  }
}

export function getUser() {
  const token = getToken()
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return decoded
  } catch (error) {
    return null
  }
}

export function logout() {
  removeToken()
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export function getAuthHeaders() {
  const token = getToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}
