import { configureStore } from '@reduxjs/toolkit';
import { saveToSessionStorage } from './sessionStorage';
import startedReducer from './startedSlice';
import userReducer    from './userSlice';
import newReducter    from './newSlice';
import allReducer     from  './allSlice';

const store = configureStore({
  reducer: {
    user:    userReducer,
    started: startedReducer,
    new:     newReducter,
    all:     allReducer,
  }
});

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;