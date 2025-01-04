import { configureStore } from '@reduxjs/toolkit';
import { saveToSessionStorage } from './sessionStorage';
import finishedReducer from './finishedSlice';
import startedReducer from './startedSlice';
import userReducer from './userSlice';
import newReducter from './newSlice';
import allReducer from './allSlice';

const store = configureStore({
    reducer: {
        finished: finishedReducer,
        started: startedReducer,
        user: userReducer,
        new: newReducter,
        all: allReducer
    }
});

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;