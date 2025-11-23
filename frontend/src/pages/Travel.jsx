import React, { useState, useEffect } from 'react'
import { searchSites, searchTreks, searchHomestays, searchFestivals } from '../lib/api'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'
import TrekCard from '../components/TrekCard'
import HomestayCard from '../components/HomestayCard'
import FestivalCard from '../components/FestivalCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Travel() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('sites')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: '',
    difficulty: '',
    category: '',
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    handleSearch()
  }, [activeTab])

  const handleSearch = async () => {
    setLoading(true)
    try {
      let response
      switch (activeTab) {
        case 'sites':
          response = await searchSites(searchQuery, filters.state, filters.category)
          break
        case 'treks':
          response = await searchTreks(searchQuery, filters.difficulty, filters.state)
          break
        case 'homestays':
          response = await searchHomestays(filters.state, filters.category)
          break
        case 'festivals':
          response = await searchFestivals('', filters.state, filters.category)
          break
      }
      setResults(response.results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'sites', label: t('spiritualSites', language) },
    { id: 'treks', label: t('treks', language) },
    { id: 'homestays', label: t('homestays', language) },
    { id: 'festivals', label: t('festivals', language) },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('travel', language)}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSearchQuery('')
                setFilters({ state: '', difficulty: '', category: '' })
              }}
              className={`pb-2 px-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('search', language)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              placeholder={t('state', language)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {activeTab === 'treks' && (
            <div>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('difficulty', language)}</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
              </select>
            </div>
          )}

          {(activeTab === 'sites' || activeTab === 'homestays' || activeTab === 'festivals') && (
            <div>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                placeholder={t('category', language)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {t('search', language)}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No results found. Try adjusting your search.
            </div>
          ) : (
            results.map((item) => {
              if (activeTab === 'treks') {
                return <TrekCard key={item.id} trek={item} />
              } else if (activeTab === 'homestays') {
                return <HomestayCard key={item.id} homestay={item} />
              } else if (activeTab === 'festivals') {
                return <FestivalCard key={item.id} festival={item} />
              } else {
                return (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {item.quick_version || item.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.state}
                    </div>
                  </div>
                )
              }
            })
          )}
        </div>
      )}
    </div>
  )
}
