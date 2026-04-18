
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import tasksReducer from './slices/tasksSlice'
import profileReducer from './slices/profileSlice'
import progressReducer from './slices/progressSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    profile: profileReducer,
    progress: progressReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export default store
