import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWellnessRoutines, getShlokas } from '../lib/api'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'
import WellnessRoutineCard from '../components/WellnessRoutineCard'
import { VideoCameraIcon } from '@heroicons/react/24/outline'

export default function Wellness() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('routines')
  const [routines, setRoutines] = useState([])
  const [shlokas, setShlokas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoutine, setSelectedRoutine] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [routinesRes, shlokasRes] = await Promise.all([
        getWellnessRoutines(),
        getShlokas()
      ])
      setRoutines(routinesRes.routines)
      setShlokas(shlokasRes.shlokas)
    } catch (error) {
      console.error('Failed to load wellness data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartRoutine = (routine) => {
    setSelectedRoutine(routine)
  }

  if (selectedRoutine) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setSelectedRoutine(null)}
          className="mb-4 text-primary-600 dark:text-primary-400 hover:underline"
        >
          ← Back to routines
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedRoutine.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {selectedRoutine.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Duration: {selectedRoutine.duration_minutes} minutes</span>
              <span>•</span>
              <span>Difficulty: {selectedRoutine.difficulty}</span>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Steps:</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {selectedRoutine.steps?.map((step, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {selectedRoutine.safety_notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Safety Notes:
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  {selectedRoutine.safety_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('wellness', language)}
        </h1>
        <Link
          to="/wellness/detect"
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <VideoCameraIcon className="w-5 h-5" />
          <span>{t('poseDetection', language)}</span>
        </Link>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('routines')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'routines'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t('yogaRoutines', language)}
        </button>
        <button
          onClick={() => setActiveTab('shlokas')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'shlokas'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Shlokas & Mantras
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : activeTab === 'routines' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map(routine => (
            <WellnessRoutineCard
              key={routine.id}
              routine={routine}
              onStart={handleStartRoutine}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shlokas.map(shloka => (
            <div key={shloka.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {shloka.category.replace('_', ' ').toUpperCase()}
              </h3>
              <div className="space-y-3">
                <div className="font-hindi text-lg text-primary-600 dark:text-primary-400">
                  {shloka.sanskrit}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {shloka.transliteration}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {shloka.meaning_english}
                </div>
                {shloka.use_context && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <strong>Usage:</strong> {shloka.use_context}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
