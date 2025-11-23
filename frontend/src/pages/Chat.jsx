import React, { useState } from 'react'
import NotebookSidebar from '../components/NotebookSidebar'
import ChatWindow from '../components/ChatWindow'

export default function Chat() {
  const [activeNotebook, setActiveNotebook] = useState(null)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <NotebookSidebar
        activeNotebook={activeNotebook}
        onSelectNotebook={setActiveNotebook}
      />
      <div className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ChatWindow notebookId={activeNotebook} />
      </div>
    </div>
  )
}
