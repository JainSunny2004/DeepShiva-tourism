import React from 'react'
import { MapPinIcon, SignalIcon, CalendarIcon } from '@heroicons/react/24/outline'

const difficultyColors = {
  'Easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Difficult': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Very Difficult': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function TrekCard({ trek }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {trek.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[trek.difficulty] || difficultyColors['Moderate']}`}>
            {trek.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {trek.quick_version}
        </p>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{trek.state}</span>
          </div>

          <div className="flex items-center space-x-2">
            <SignalIcon className="w-4 h-4" />
            <span>Max Altitude: {trek.max_altitude_m}m</span>
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Best: {trek.best_season}</span>
          </div>
        </div>

        {trek.avoid_common_mistake && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ {trek.avoid_common_mistake}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
