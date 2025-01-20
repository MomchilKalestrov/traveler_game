import { configureStore } from '@reduxjs/toolkit';
import { saveToSessionStorage } from './sessionStorage';
import finishedReducer from './finishedSlice';
import startedReducer from './startedSlice';
import userReducer from './userSlice';
import newReducter from './newSlice';
import allReducer from './allSlice';
import communityReducer from './communitySlice';
import customLocationsReducer from './customLocationsSlice';

const store = configureStore({
    reducer: {
        finished: finishedReducer,
        started: startedReducer,
        user: userReducer,
        new: newReducter,
        all: allReducer,
        community: communityReducer,
        custom: customLocationsReducer
    }
});

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;