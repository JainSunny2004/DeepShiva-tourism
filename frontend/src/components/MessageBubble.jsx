import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const personaEmojis = {
  pers001: '🧭',
  pers002: '🕉️',
  pers003: '🏔️',
  pers004: '📚',
  pers005: '🛡️',
}

const personaNames = {
  pers001: 'Ravi',
  pers002: 'Guru Ananda',
  pers003: 'Arjun',
  pers004: 'Dr. Meera',
  pers005: 'Kavya',
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div className={`flex space-x-2 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm">
              {personaEmojis[message.personaUsed] || '🤖'}
            </div>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {!isUser && message.personaUsed && (
            <div className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">
              {personaNames[message.personaUsed]}
            </div>
          )}

          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
            {isUser ? (
              <p className="m-0">{message.content}</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Sources:</span>
                {message.sources.map((source, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isUser && message.confidence !== undefined && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Confidence: {Math.round(message.confidence * 100)}%
            </div>
          )}
        </div>

        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
