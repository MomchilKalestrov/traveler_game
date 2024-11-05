import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import startedReducer from './startedSlice';
import newReducter from './newSlice';
import { saveToSessionStorage } from './sessionStorage';

const store = configureStore({
  reducer: {
    user:    userReducer,
    started: startedReducer,
    new:     newReducter
  }
});

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;