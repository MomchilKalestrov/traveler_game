import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import startedReducer from './startedSlice';

const store = configureStore({
  reducer: {
    user:    userReducer,
    started: startedReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;