import { configureStore } from '@reduxjs/toolkit'
import tasksSlice from './tasksSlice'
import usersSlice from './usersSlice'
import historySlice from './historySlice'
import notificationsSlice from './notificationsSlice'
import updatesSlice from './updatesSlice'
import authSlice from './authSlice'

export const store = configureStore({    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }), 
    reducer: {
        tasks: tasksSlice.reducer,
        users: usersSlice.reducer,
        history: historySlice.reducer,
        notifications: notificationsSlice.reducer,
        updates: updatesSlice.reducer,
        auth: authSlice.reducer
} })

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch