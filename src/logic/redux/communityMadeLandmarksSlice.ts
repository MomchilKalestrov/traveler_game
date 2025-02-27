import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityLandmark, User } from '@logic/types';
import { findAndReplace } from '@logic/utils';

export const communityMadeLandmarksSlice = createSlice({
    name: 'communityMadeLandmarks',
    initialState: {
        value: {
            all: undefined as CommunityLandmark[] | undefined,
            markedForVisit: undefined as CommunityLandmark[] | undefined,
            visited: undefined as CommunityLandmark[] | undefined,
            new: undefined as CommunityLandmark[] | undefined,
        },
    },
    reducers: {
        markForVisit: (state, action: PayloadAction<CommunityLandmark>) => {
            if (!state.value.markedForVisit) state.value.markedForVisit = [];
            if (!state.value.new) state.value.new = [];
            
            state.value.markedForVisit.push(action.payload);
            state.value.new = state.value.new.filter(loc => loc.name !== action.payload.name);
        },
        unmarkForVisit: (state, action: PayloadAction<CommunityLandmark>) => {
            if (!state.value.markedForVisit) state.value.markedForVisit = [];
            if (!state.value.new) state.value.new = [];

            state.value.markedForVisit = state.value.markedForVisit.filter(loc => loc.name !== action.payload.name);
            state.value.new.push(action.payload);
        },
        visit: (state, action: PayloadAction<CommunityLandmark>) => {
            if (!state.value.markedForVisit) state.value.markedForVisit = [];
            if (!state.value.visited) state.value.visited = [];

            state.value.markedForVisit = state.value.markedForVisit.filter(loc => loc.name !== action.payload.name);
            state.value.visited.push(action.payload);
        },
        add: (state, action: PayloadAction<{ landmarks: CommunityLandmark[], user: User }>) => {
            if (!state.value.all) state.value.all = [];
            if (!state.value.new) state.value.new = [];
            if (!state.value.visited) state.value.visited = [];
            if (!state.value.markedForVisit)  state.value.markedForVisit  = [];

            const { landmarks, user } = action.payload;
            
            landmarks.forEach((landmark: CommunityLandmark) => {
                if (state.value.all?.find(l => l.name === landmark.name)) return;

                state.value.all?.push(landmark);

                if (user.markedForVisit.includes(`community#${ landmark.name }`))
                    state.value.markedForVisit?.push(landmark);
                else if (user.visited.find(l => l.dbname === `community#${ landmark.name }`))
                    state.value.visited?.push(landmark);
                else
                    state.value.new?.push(landmark);

            });
        },
        updateAll: (state, action: PayloadAction<CommunityLandmark[]>) => {
            state.value.all = action.payload;
        },
        updateMarkedForVisit: (state, action: PayloadAction<CommunityLandmark[]>) => {
            state.value.markedForVisit = action.payload;
        },
        updateVisited: (state, action: PayloadAction<CommunityLandmark[]>) => {
            state.value.visited = action.payload;
        },
        updateNew: (state, action: PayloadAction<CommunityLandmark[]>) => {
            state.value.new = action.payload;
        },
        like: (state, action: PayloadAction<{ name: string, username: string }>) => {
            if (!state.value.all) state.value.all = [];
            if (!state.value.new) state.value.new = [];
            if (!state.value.visited) state.value.visited = [];
            if (!state.value.markedForVisit)  state.value.markedForVisit  = [];

            const { name, username } = action.payload;

            state.value = Object.fromEntries(
                Object
                    .entries(state.value)
                    .map(([ key, landmarks ]: [ string, CommunityLandmark[] | undefined ]) => [
                        key,
                        findAndReplace(landmarks!, (lm) => lm.name === name, (lm) => ({
                            ...lm,
                            likes: [...lm.likes, username],
                        })),
                    ])
            ) as typeof state.value;
        }
    }
});

export const { updateAll, updateMarkedForVisit, updateVisited, updateNew, markForVisit, unmarkForVisit, visit, add } = communityMadeLandmarksSlice.actions;
export default communityMadeLandmarksSlice.reducer;