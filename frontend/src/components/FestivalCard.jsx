import React from 'react'
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function FestivalCard({ festival }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {festival.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {festival.quick_version}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>{festival.typical_months?.join(', ') || 'Various dates'}</span>
          </div>

          {festival.states_celebrated && festival.states_celebrated.length > 0 && (
            <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
              <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{festival.states_celebrated.join(', ')}</span>
            </div>
          )}
        </div>

        {festival.mythological_background && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 rounded">
            <p className="text-xs text-purple-800 dark:text-purple-200 line-clamp-2">
              {festival.mythological_background}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
