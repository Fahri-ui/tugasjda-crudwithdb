"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import {
  fetchTodos,
  addTodo as addTodoAction,
  updateTodo,
  deleteTodo as deleteTodoAction,
  clearError,
  type Todo,
} from "@/lib/features/todoSlice"
import TodoSkeleton from "@/components/loadingSkeleton/todoSkeleton"
import StatsSkeleton from "@/components/loadingSkeleton/statsSkeleton"
import TodoListActive from "@/components/todoListActive"
import TodoListCompleted from "@/components/todoListCompleted"
import TodoStats from "@/components/todoState"

export default function Home() {
  const dispatch = useAppDispatch()
  const { todos, loading, initialLoading, error } = useAppSelector((state) => state.todo)

  // Local state untuk form dan editing
  const [newTitle, setNewTitle] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  // Clear error setelah beberapa detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleAddTodo = async () => {
    if (!newTitle.trim()) return

    try {
      await dispatch(addTodoAction(newTitle)).unwrap()
      setNewTitle("")
    } catch (error) {
      console.error("Error adding todo:", error)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending"
    try {
      await dispatch(updateTodo({ id, status: newStatus })).unwrap()
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  const handleSaveEdit = async () => {
    if (!editingTitle.trim() || !editingId) return

    try {
      await dispatch(updateTodo({ id: editingId, title: editingTitle.trim() })).unwrap()
      setEditingId(null)
      setEditingTitle("")
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const handleDeleteTodo = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus todo ini?")) return

    try {
      await dispatch(deleteTodoAction(id)).unwrap()
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action()
    }
  }

  const completedTodos = todos.filter((todo) => todo.status === "completed")
  const activeTodos = todos.filter((todo) => todo.status === "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            ✨ Todo Manager
          </h1>
          <p className="text-slate-400">Kelola tugas Anda dengan efisien</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-200">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Form Component */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-xl">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Tambahkan tugas baru..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddTodo)}
              disabled={loading}
            />
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              onClick={handleAddTodo}
              disabled={loading || !newTitle.trim()}
            >
              {loading ? "⏳" : "➕"} Tambah
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {initialLoading ? (
            <>
              <StatsSkeleton />
              <StatsSkeleton />
              <StatsSkeleton />
            </>
          ) : (
            <TodoStats total={todos.length} active={activeTodos.length} completed={completedTodos.length} />
          )}
        </div>

        {/* Active Todos */}
        {initialLoading ? (
          <div className="mb-8">
            <div className="w-48 h-6 bg-slate-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <TodoSkeleton />
              <TodoSkeleton />
              <TodoSkeleton />
            </div>
          </div>
        ) : activeTodos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
              🔥 Tugas Aktif ({activeTodos.length})
            </h2>
            <div className="space-y-3">
              <TodoListActive
                todos={activeTodos}
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                startEditing={startEditing}
                saveEdit={handleSaveEdit}
                cancelEdit={cancelEdit}
                toggleStatus={handleToggleStatus}
                deleteTodo={handleDeleteTodo}
                handleKeyPress={handleKeyPress}
              />
            </div>
          </div>
        ) : null}

        {/* Completed Todos */}
        {!initialLoading && completedTodos.length > 0 && (
          <TodoListCompleted todos={completedTodos} toggleStatus={handleToggleStatus} deleteTodo={handleDeleteTodo} />
        )}

        {/* Empty State */}
        {!initialLoading && todos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Belum ada tugas</h3>
            <p className="text-slate-400">Tambahkan tugas pertama Anda untuk memulai!</p>
          </div>
        )}
      </div>
    </div>
  )
}
