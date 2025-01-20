import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityLocation, User, toCommunityLocation } from '@logic/types';

export const communitySlice = createSlice({
    name: 'community',
    initialState: {
        value: {
            all: undefined as CommunityLocation[] | undefined,
            started: undefined as CommunityLocation[] | undefined,
            finished: undefined as CommunityLocation[] | undefined,
            new: undefined as CommunityLocation[] | undefined,
        },
    },
    reducers: {
        track: (state, action: PayloadAction<CommunityLocation>) => {
            if (!state.value.started) state.value.started = [];
            if (!state.value.new)     state.value.new = [];
            
            state.value.started.push(action.payload);
            state.value.new = state.value.new.filter(loc => loc.name !== action.payload.name);
        },
        untrack: (state, action: PayloadAction<CommunityLocation>) => {
            if (!state.value.started) state.value.started = [];
            if (!state.value.new)     state.value.new = [];

            state.value.started = state.value.started.filter(loc => loc.name !== action.payload.name);
            state.value.new.push(action.payload);
        },
        finish: (state, action: PayloadAction<CommunityLocation>) => {
            if (!state.value.started)  state.value.started = [];
            if (!state.value.finished) state.value.finished = [];

            state.value.started = state.value.started.filter(loc => loc.name !== action.payload.name);
            state.value.finished.push(action.payload);
        },
        add: (state, action: PayloadAction<{ locations: CommunityLocation[], user: User }>) => {
            if (!state.value.all) state.value.all = [];
            if (!state.value.new) state.value.new = [];
            if (!state.value.finished) state.value.finished = [];
            if (!state.value.started)  state.value.started  = [];

            const { locations, user } = action.payload;
            
            locations.forEach(location => {
                const cleanLocation = toCommunityLocation(location);

                if (state.value.all?.find(l => l.name === cleanLocation.name)) return;

                state.value.all?.push(cleanLocation);

                if (user.started.includes(`community#${ cleanLocation.name }`))
                    state.value.started?.push(cleanLocation);
                else if (user.finished.find(f => f.location === `community#${ cleanLocation.name }`))
                    state.value.finished?.push(cleanLocation);
                else
                    state.value.new?.push(cleanLocation);

            });
        },
        updateAll: (state, action: PayloadAction<CommunityLocation[]>) => {
            state.value.all = action.payload;
        },
        updateStarted: (state, action: PayloadAction<CommunityLocation[]>) => {
            state.value.started = action.payload;
        },
        updateFinished: (state, action: PayloadAction<CommunityLocation[]>) => {
            state.value.finished = action.payload;
        },
        updateNew: (state, action: PayloadAction<CommunityLocation[]>) => {
            state.value.new = action.payload;
        }
    }
});

export const { updateAll, updateStarted, updateFinished, updateNew, track, untrack, finish, add } = communitySlice.actions;
export default communitySlice.reducer;