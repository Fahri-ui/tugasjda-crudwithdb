"use client";
import React from "react";

interface Todo {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

interface TodoListCompletedProps {
  todos: Todo[];
  toggleStatus: (id: number, currentStatus: string) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoListCompleted({
  todos,
  toggleStatus,
  deleteTodo,
}: TodoListCompletedProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
        ✅ Tugas Selesai ({todos.length})
      </h2>
      <div className="space-y-3">
        {todos.map((todo) => (
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
  );
}
