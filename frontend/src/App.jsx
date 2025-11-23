import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from './lib/auth'
import { LanguageProvider } from './lib/LanguageContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Travel from './pages/Travel'
import Wellness from './pages/Wellness'
import Eco from './pages/Eco'
import Crowd from './pages/Crowd'
import Personas from './pages/Personas'
import YogaDetector from './pages/YogaDetector'

// Components
import Navbar from './components/Navbar'

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', !darkMode)
  }

  return (
    <LanguageProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="/travel" element={
              <ProtectedRoute>
                <Travel />
              </ProtectedRoute>
            } />
            
            <Route path="/wellness" element={
              <ProtectedRoute>
                <Wellness />
              </ProtectedRoute>
            } />
            
            <Route path="/wellness/detect" element={
              <ProtectedRoute>
                <YogaDetector />
              </ProtectedRoute>
            } />
            
            <Route path="/eco" element={
              <ProtectedRoute>
                <Eco />
              </ProtectedRoute>
            } />
            
            <Route path="/crowd" element={
              <ProtectedRoute>
                <Crowd />
              </ProtectedRoute>
            } />
            
            <Route path="/personas" element={
              <ProtectedRoute>
                <Personas />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
