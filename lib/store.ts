import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import todoReducer from "@/lib/features/todoSlice"

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
