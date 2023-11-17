import { configureStore } from '@reduxjs/toolkit'
import tasksSlice from './tasksSlice'
import usersSlice from './usersSlice'
import historySlice from './historySlice'
import notificationsSlice from './notificationsSlice'

export const store = configureStore({ reducer: {
    tasks: tasksSlice.reducer,
    users: usersSlice.reducer,
    history: historySlice.reducer,
    notifications: notificationsSlice.reducer
} })

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch