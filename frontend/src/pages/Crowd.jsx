import React, { useState } from 'react'
import { getCrowdPrediction, getBestTimes } from '../lib/api'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'

export default function Crowd() {
  const { language } = useLanguage()
  const [locationId, setLocationId] = useState('')
  const [date, setDate] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [bestTimes, setBestTimes] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    if (!locationId || !date) return

    setLoading(true)
    try {
      const [predRes, timesRes] = await Promise.all([
        getCrowdPrediction(locationId, date),
        getBestTimes(locationId)
      ])
      setPrediction(predRes.prediction)
      setBestTimes(timesRes.bestTimes)
    } catch (error) {
      console.error('Prediction failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const crowdLevelColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    extreme: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('crowd', language)}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('checkCrowds', language)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('selectLocation', language)}
            </label>
            <input
              type="text"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="sp001 (Kedarnath)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter location ID (e.g., sp001, sp009)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('selectDate', language)}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !locationId || !date}
          className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : t('predict', language)}
        </button>
      </div>

      {prediction && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Crowd Prediction
            </h3>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-gray-600 dark:text-gray-400">Expected crowd level:</span>
              <span className={`px-4 py-2 rounded-lg font-semibold uppercase ${crowdLevelColors[prediction.level] || crowdLevelColors.moderate}`}>
                {prediction.level}
              </span>
            </div>

            {prediction.estimatedWaitTime && (
              <div className="mb-4">
                <span className="text-gray-600 dark:text-gray-400">Estimated wait time: </span>
                <span className="font-semibold text-gray-900 dark:text-white">{prediction.estimatedWaitTime}</span>
              </div>
            )}

            {prediction.factors && prediction.factors.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Factors:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                  {prediction.factors.map((factor, idx) => (
                    <li key={idx}>• {factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.recommendation && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  💡 {prediction.recommendation}
                </p>
              </div>
            )}
          </div>

          {bestTimes && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('bestTimeToVisit', language)}
              </h3>

              <div className="space-y-3">
                {bestTimes.bestMonths && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Months:</span>
                    <p className="text-gray-900 dark:text-white">{bestTimes.bestMonths.join(', ')}</p>
                  </div>
                )}

                {bestTimes.avoidMonths && bestTimes.avoidMonths.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avoid:</span>
                    <p className="text-gray-900 dark:text-white">{bestTimes.avoidMonths.join(', ')}</p>
                  </div>
                )}

                {bestTimes.bestTimeOfDay && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Time of Day:</span>
                    <p className="text-gray-900 dark:text-white">{bestTimes.bestTimeOfDay}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
