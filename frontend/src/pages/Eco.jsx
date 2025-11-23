import React, { useState, useEffect } from 'react'
import { calculateCarbon, compareTransport, getEcoTips, getEcoHomestays } from '../lib/api'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Eco() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('calculator')
  const [carbonData, setCarbonData] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [tips, setTips] = useState([])
  const [homestays, setHomestays] = useState([])
  const [formData, setFormData] = useState({
    travelMode: 'train',
    distanceKm: '',
    accommodationType: 'homestay',
    durationDays: '',
  })

  useEffect(() => {
    if (activeTab === 'tips') {
      loadTips()
    } else if (activeTab === 'homestays') {
      loadHomestays()
    }
  }, [activeTab])

  const loadTips = async () => {
    try {
      const response = await getEcoTips()
      setTips(response.tips)
    } catch (error) {
      console.error('Failed to load tips:', error)
    }
  }

  const loadHomestays = async () => {
    try {
      const response = await getEcoHomestays(4)
      setHomestays(response.homestays)
    } catch (error) {
      console.error('Failed to load homestays:', error)
    }
  }

  const handleCalculate = async () => {
    try {
      const response = await calculateCarbon(
        formData.travelMode,
        parseFloat(formData.distanceKm),
        formData.accommodationType,
        parseInt(formData.durationDays)
      )
      setCarbonData(response.carbonFootprint)

      const comparisonRes = await compareTransport(parseFloat(formData.distanceKm))
      setComparison(comparisonRes.comparison)
    } catch (error) {
      console.error('Calculation failed:', error)
    }
  }

  const chartData = comparison ? {
    labels: comparison.map(c => c.mode.charAt(0).toUpperCase() + c.mode.slice(1)),
    datasets: [{
      label: 'CO₂ Emissions (kg)',
      data: comparison.map(c => c.emissions),
      backgroundColor: comparison.map(c => 
        c.recommended ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
      ),
    }]
  } : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('eco', language)}
      </h1>

      <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        {['calculator', 'tips', 'homestays'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'calculator' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('carbonFootprint', language)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('transport', language)}
                </label>
                <select
                  value={formData.travelMode}
                  onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="car">Car</option>
                  <option value="flight">Flight</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('accommodation', language)}
                </label>
                <select
                  value={formData.accommodationType}
                  onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="homestay">Homestay</option>
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="camping">Camping</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('duration', language)} (days)
                </label>
                <input
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="7"
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              {t('calculate', language)}
            </button>
          </div>

          {carbonData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Carbon Footprint
                </h3>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {carbonData.totalKg} kg CO₂
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Travel:</span>
                    <span>{carbonData.breakdown.travel} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accommodation:</span>
                    <span>{carbonData.breakdown.accommodation} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food:</span>
                    <span>{carbonData.breakdown.food} kg</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Transport Comparison
                </h3>
                {chartData && <Bar data={chartData} options={{ responsive: true }} />}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map(tip => (
            <div key={tip.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {tip.context}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {tip.quick_version}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 rounded p-2">
                💡 {tip.tip}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'homestays' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homestays.map(homestay => (
            <div key={homestay.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {homestay.name}
                </h3>
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ⭐ {homestay.eco_rating}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {homestay.state}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {homestay.quick_version}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
