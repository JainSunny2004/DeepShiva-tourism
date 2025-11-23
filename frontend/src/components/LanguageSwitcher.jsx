import React from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { LanguageIcon } from '@heroicons/react/24/outline'

export default function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <LanguageIcon className="w-4 h-4 text-gray-600 dark:text-gray-300 ml-2" />
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('hi')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors font-hindi ${
          language === 'hi'
            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        हिं
      </button>
    </div>
  )
}
