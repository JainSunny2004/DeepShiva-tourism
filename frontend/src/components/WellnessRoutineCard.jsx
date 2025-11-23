import React from 'react'
import { ClockIcon, HeartIcon } from '@heroicons/react/24/outline'

export default function WellnessRoutineCard({ routine, onStart }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {routine.name}
          </h3>
          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
            {routine.routine_type}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {routine.quick_version}
        </p>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>{routine.duration_minutes} minutes</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <HeartIcon className="w-4 h-4" />
            <span>{routine.target_mood}</span>
          </div>

          <div className="mt-2">
            <span className={`px-2 py-1 rounded text-xs ${
              routine.difficulty === 'Beginner'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : routine.difficulty === 'Intermediate'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {routine.difficulty}
            </span>
          </div>
        </div>

        <button
          onClick={() => onStart(routine)}
          className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Start Session
        </button>
      </div>
    </div>
  )
}
