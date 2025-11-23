import React, { useState, useEffect } from 'react'
import { getAllPersonas } from '../lib/api'

const personaColors = {
  pers001: 'bg-blue-500',
  pers002: 'bg-purple-500',
  pers003: 'bg-green-500',
  pers004: 'bg-amber-500',
  pers005: 'bg-red-500',
}

const personaEmojis = {
  pers001: '🧭',
  pers002: '🕉️',
  pers003: '🏔️',
  pers004: '📚',
  pers005: '🛡️',
}

export default function PersonaSelector({ selectedPersona, onSelectPersona, autoMode, onToggleAuto }) {
  const [personas, setPersonas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPersonas()
  }, [])

  const loadPersonas = async () => {
    try {
      const response = await getAllPersonas()
      setPersonas(response.personas)
    } catch (error) {
      console.error('Failed to load personas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggleAuto}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          autoMode
            ? 'bg-primary-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        Auto
      </button>

      <div className="flex space-x-2">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona.id)}
            disabled={autoMode}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
              personaColors[persona.id]
            } ${
              selectedPersona === persona.id && !autoMode
                ? 'ring-4 ring-primary-300 dark:ring-primary-700 scale-110'
                : 'opacity-70 hover:opacity-100'
            } ${
              autoMode ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            title={persona.name}
          >
            <span>{personaEmojis[persona.id]}</span>
            {selectedPersona === persona.id && !autoMode && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
