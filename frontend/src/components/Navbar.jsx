import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'
import { logout, isAuthenticated } from '../lib/auth'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  HeartIcon,
  SparklesIcon,
  CloudIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/', label: t('home', language), icon: HomeIcon },
    { path: '/chat', label: t('chat', language), icon: ChatBubbleLeftRightIcon, protected: true },
    { path: '/travel', label: t('travel', language), icon: MapIcon, protected: true },
    { path: '/wellness', label: t('wellness', language), icon: HeartIcon, protected: true },
    { path: '/eco', label: t('eco', language), icon: SparklesIcon, protected: true },
    { path: '/crowd', label: t('crowd', language), icon: CloudIcon, protected: true },
    { path: '/personas', label: t('personas', language), icon: UserGroupIcon, protected: true },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                India Travel
              </span>
            </Link>

            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => {
                if (link.protected && !authenticated) return null
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {authenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>{t('logout', language)}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {t('login', language)}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
