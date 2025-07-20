'use client'

import { useState } from 'react'

interface Props {
  onAdd: (title: string) => void
  isLoading?: boolean
}

export default function TodoForm({ onAdd, isLoading }: Props) {
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd(title.trim())
    setTitle('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-xl">
      <div className="flex gap-3">
        <input
          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Tambahkan tugas baru..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
          onClick={handleAdd}
          disabled={isLoading || !title.trim()}
        >
          ➕ Tambah
        </button>
      </div>
    </div>
  )
}
