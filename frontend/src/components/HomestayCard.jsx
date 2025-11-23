import React from 'react'
import { MapPinIcon, SparklesIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline'

export default function HomestayCard({ homestay }) {
  const ecoRating = homestay.eco_rating || 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {homestay.name}
          </h3>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <SparklesIcon
                key={i}
                className={`w-4 h-4 ${
                  i < ecoRating
                    ? 'text-green-500 fill-green-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {homestay.quick_version}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPinIcon className="w-4 h-4" />
            <span>{homestay.state}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <CurrencyRupeeIcon className="w-4 h-4" />
            <span>{homestay.price_range}</span>
          </div>
        </div>

        {homestay.sustainability_practices && homestay.sustainability_practices.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {homestay.sustainability_practices.slice(0, 3).map((practice, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
              >
                {practice}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
