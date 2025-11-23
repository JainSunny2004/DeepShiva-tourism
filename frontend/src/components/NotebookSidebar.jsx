import React, { useState, useEffect } from 'react'
import { getNotebooks, createNotebook, deleteNotebook } from '../lib/api'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/ui'
import {
  PlusIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function NotebookSidebar({ activeNotebook, onSelectNotebook }) {
  const { language } = useLanguage()
  const [notebooks, setNotebooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotebooks()
  }, [])

  const loadNotebooks = async () => {
    try {
      const response = await getNotebooks()
      setNotebooks(response.notebooks)
      
      if (response.notebooks.length > 0 && !activeNotebook) {
        onSelectNotebook(response.notebooks[0]._id)
      }
    } catch (error) {
      console.error('Failed to load notebooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNotebook = async () => {
    try {
      const response = await createNotebook(t('newChat', language))
      setNotebooks([response.notebook, ...notebooks])
      onSelectNotebook(response.notebook._id)
    } catch (error) {
      console.error('Failed to create notebook:', error)
    }
  }

  const handleDeleteNotebook = async (notebookId, e) => {
    e.stopPropagation()
    
    if (!confirm('Delete this chat?')) return

    try {
      await deleteNotebook(notebookId)
      setNotebooks(notebooks.filter(n => n._id !== notebookId))
      
      if (activeNotebook === notebookId && notebooks.length > 1) {
        const nextNotebook = notebooks.find(n => n._id !== notebookId)
        if (nextNotebook) {
          onSelectNotebook(nextNotebook._id)
        }
      }
    } catch (error) {
      console.error('Failed to delete notebook:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCreateNotebook}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>{t('newChat', language)}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notebooks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notebooks.map((notebook) => (
              <div
                key={notebook._id}
                onClick={() => onSelectNotebook(notebook._id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeNotebook === notebook._id
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <ChatBubbleLeftIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{notebook.title}</span>
                </div>
                
                <button
                  onClick={(e) => handleDeleteNotebook(notebook._id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-opacity"
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
