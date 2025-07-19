"use client";

import TodoSkeleton from "@/components/todoSkeleton";
import StatsSkeleton from "@/components/statsSkeleton";
import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      setNewTitle("");
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async () => {
    if (!editingTitle.trim() || !editingId) return;

    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingId, title: editingTitle.trim() }),
      });
      setEditingId(null);
      setEditingTitle("");
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const deleteTodo = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus todo ini?")) return;

    try {
      await fetch("/api/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

const completedTodos = todos.filter(todo => todo.status === "completed");
const activeTodos = todos.filter(todo => todo.status === "pending");


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            ✨ Todo Manager
          </h1>
          <p className="text-slate-400">Kelola tugas Anda dengan efisien</p>
        </div>

        {/* Add Todo Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-xl">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Tambahkan tugas baru..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTodo)}
              disabled={isLoading}
            />
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              onClick={addTodo}
              disabled={isLoading || !newTitle.trim()}
            >
              ➕ Tambah
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isInitialLoading ? (
            <>
              <StatsSkeleton />
              <StatsSkeleton />
              <StatsSkeleton />
            </>
          ) : (
            <>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-blue-400">{todos.length}</div>
                <div className="text-slate-400 text-sm">Total Tugas</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-yellow-400">{activeTodos.length}</div>
                <div className="text-slate-400 text-sm">Belum Selesai</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-green-400">{completedTodos.length}</div>
                <div className="text-slate-400 text-sm">Selesai</div>
              </div>
            </>
          )}
        </div>

        {/* Active Todos */}
        {isInitialLoading ? (
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
              {activeTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus(todo.id, todo.status)}
                      className="w-6 h-6 border-2 border-slate-500 rounded-full hover:border-blue-500 transition-colors duration-200 flex items-center justify-center group"
                    >
                      <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </button>

                    {editingId === todo.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors duration-200"
                        >
                          ✅
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors duration-200"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-white font-medium">{todo.title}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(todo)}
                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors duration-200"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors duration-200"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* status Todos */}
        {!isInitialLoading && completedTodos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
              ✅ Tugas Selesai ({completedTodos.length})
            </h2>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 opacity-75 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus(todo.id, todo.status)}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                    >
                      ✓
                    </button>
                    
                    <span className="flex-1 text-slate-400 line-through">{todo.title}</span>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors duration-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isInitialLoading && todos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Belum ada tugas</h3>
            <p className="text-slate-400">Tambahkan tugas pertama Anda untuk memulai!</p>
          </div>
        )}
      </div>
    </div>
  );
}