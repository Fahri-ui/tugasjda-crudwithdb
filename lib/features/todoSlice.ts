import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface Todo {
  id: number
  title: string
  status: string
  createdAt: string
}

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await fetch("/api/todos")
  if (!response.ok) {
    throw new Error("Failed to fetch todos")
  }
  return response.json()
})

export const addTodo = createAsyncThunk("todos/addTodo", async (title: string) => {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title.trim() }),
  })
  if (!response.ok) {
    throw new Error("Failed to add todo")
  }
  return response.json()
})

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (data: { id: number; title?: string; status?: string }) => {
    const response = await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update todo")
    }
    return response.json()
  },
)

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id: number) => {
  const response = await fetch("/api/todos", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  if (!response.ok) {
    throw new Error("Failed to delete todo")
  }
  return id
})

interface TodoState {
  todos: Todo[]
  loading: boolean
  initialLoading: boolean
  error: string | null
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  initialLoading: true,
  error: null,
}

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload
        state.loading = false
        state.initialLoading = false
        state.error = null
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.initialLoading = false
        state.error = action.error.message || "Failed to fetch todos"
      })

      // Add todo
      .addCase(addTodo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload)
        state.loading = false
        state.error = null
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to add todo"
      })

      // Update todo
      .addCase(updateTodo.pending, (state) => {
        state.error = null
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const idx = state.todos.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) {
          state.todos[idx] = action.payload
        }
        state.error = null
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update todo"
      })

      // Delete todo
      .addCase(deleteTodo.pending, (state) => {
        state.error = null
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload)
        state.error = null
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete todo"
      })
  },
})

export const { clearError } = todoSlice.actions
export default todoSlice.reducer
