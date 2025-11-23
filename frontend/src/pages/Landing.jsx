import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'
import { 
  ChatBubbleLeftRightIcon,
  MapIcon,
  HeartIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export default function Landing() {
  const { language } = useLanguage()

  const features = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Travel Companion',
      description: 'Chat with AI personas expert in spiritual sites, treks, safety, and culture',
      color: 'text-blue-500',
    },
    {
      icon: MapIcon,
      title: 'Smart Travel Planning',
      description: 'Discover 50+ spiritual sites, 10+ treks, eco-homestays, and festivals',
      color: 'text-green-500',
    },
    {
      icon: HeartIcon,
      title: 'Wellness & Yoga',
      description: 'Guided yoga routines, meditation, shlokas, and AI pose detection',
      color: 'text-purple-500',
    },
    {
      icon: SparklesIcon,
      title: 'Eco-Tourism',
      description: 'Carbon footprint calculator, sustainable travel tips, and green homestays',
      color: 'text-amber-500',
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              🇮🇳 India Travel Companion
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your AI-powered guide to spiritual India. Explore sacred sites, plan treks, 
              practice wellness, and travel sustainably with personalized insights.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-lg font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/chat"
                className="px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-medium border-2 border-primary-500"
              >
                Try Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-primary-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Your AI Personas
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Five expert personas to guide your journey - from local insights to spiritual wisdom
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { emoji: '🧭', name: 'Ravi', role: 'Local Guide' },
              { emoji: '🕉️', name: 'Guru Ananda', role: 'Spiritual Teacher' },
              { emoji: '🏔️', name: 'Arjun', role: 'Trek Expert' },
              { emoji: '📚', name: 'Dr. Meera', role: 'Historian' },
              { emoji: '🛡️', name: 'Kavya', role: 'Safety Guardian' },
            ].map((persona, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-md"
              >
                <div className="text-4xl mb-2">{persona.emoji}</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {persona.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {persona.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Explore India?
        </h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Join thousands of travelers discovering India with AI guidance
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-lg font-medium"
        >
          Start Your Journey
        </Link>
      </div>
    </div>
  )
}
