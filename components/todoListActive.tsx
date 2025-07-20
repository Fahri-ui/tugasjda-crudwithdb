"use client";
import React from "react";

interface Todo {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

interface TodoListActiveProps {
  todos: Todo[];
  editingId: number | null;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  startEditing: (todo: Todo) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  toggleStatus: (id: number, currentStatus: string) => void;
  deleteTodo: (id: number) => void;
  handleKeyPress: (e: React.KeyboardEvent, action: () => void) => void;
}

export default function TodoListActive({
  todos,
  editingId,
  editingTitle,
  setEditingTitle,
  startEditing,
  saveEdit,
  cancelEdit,
  toggleStatus,
  deleteTodo,
  handleKeyPress,
}: TodoListActiveProps) {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200 shadow-lg"
        >
          <div className="flex items-center gap-3">
            {/* Toggle status */}
            <button
              onClick={() => toggleStatus(todo.id, todo.status)}
              className="w-6 h-6 border-2 border-slate-500 rounded-full hover:border-blue-500 transition-colors duration-200 flex items-center justify-center group"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>

            {/* Jika sedang edit */}
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
                {/* Tampilan normal */}
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
  );
}
