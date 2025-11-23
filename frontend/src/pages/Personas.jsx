import React, { useState, useEffect } from 'react'
import { getAllPersonas, setPreferredPersona } from '../lib/api'

const personaColors = {
  pers001: 'from-blue-400 to-blue-600',
  pers002: 'from-purple-400 to-purple-600',
  pers003: 'from-green-400 to-green-600',
  pers004: 'from-amber-400 to-amber-600',
  pers005: 'from-red-400 to-red-600',
}

const personaEmojis = {
  pers001: '🧭',
  pers002: '🕉️',
  pers003: '🏔️',
  pers004: '📚',
  pers005: '🛡️',
}

export default function Personas() {
  const [personas, setPersonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [preferred, setPreferred] = useState(null)

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

  const handleSetPreferred = async (personaId) => {
    try {
      await setPreferredPersona(personaId)
      setPreferred(personaId)
    } catch (error) {
      console.error('Failed to set preferred persona:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-48"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        AI Personas
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Choose your preferred travel companion. Each persona offers unique insights and perspectives.
      </p>

      <div className="space-y-6">
        {personas.map(persona => (
          <div
            key={persona.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex">
              <div className={`w-32 bg-gradient-to-br ${personaColors[persona.id]} flex items-center justify-center text-6xl`}>
                {personaEmojis[persona.id]}
              </div>

              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {persona.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {persona.category.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSetPreferred(persona.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      preferred === persona.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {preferred === persona.id ? '✓ Preferred' : 'Set as Preferred'}
                  </button>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {persona.quick_version}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {persona.description}
                </p>

                {persona.typical_use_cases && (
                  <div className="flex flex-wrap gap-2">
                    {persona.typical_use_cases.map((useCase, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
