import { configureStore } from '@reduxjs/toolkit';
import { saveToSessionStorage } from './sessionStorage';
import visitedLandmarks from './visitedLandmarksSlice';
import landmarksMarkedForVisit from './landmarksMarkedForVisitSlice';
import user from './userSlice';
import newLandmarks from './newLandmarksSlice';
import allLandmarks from './allLandmarksSlice';
import communityMadeLandmarks from './communityMadeLandmarksSlice';
import userMadeLandmarks from './userMadeLandmarksSlice';

const store = configureStore({
    reducer: {
        visitedLandmarks,
        landmarksMarkedForVisit,
        user,
        newLandmarks,
        allLandmarks,
        communityMadeLandmarks,
        userMadeLandmarks
    }
});

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;