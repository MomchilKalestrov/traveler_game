import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Landmark } from '@logic/types';

export const userSlice = createSlice({
    name: 'user',
    initialState: { value: undefined as User | undefined },
    reducers: {
        update: (state, action: PayloadAction<User>) => {
            state.value = action.payload;
        },
        follow: (state, action: PayloadAction<string>) => {
            sessionStorage.removeItem('activities');
            if (!state.value) return;
            state.value.following.push(action.payload);
        },
        unfollow: (state, action: PayloadAction<string>) => {
            sessionStorage.removeItem('activities');
            if (!state.value) return;
            state.value.following = state.value.following.filter(username => username !== action.payload);
        },
        markForVisit: (state, action: PayloadAction<string>) => {
            if (!state.value) return;
            state.value.markedForVisit.push(action.payload);
        },
        unmarkForVisit: (state, action: PayloadAction<string>) => {
            if (!state.value) return;
            state.value.markedForVisit = state.value.markedForVisit.filter(dbname => dbname !== action.payload);
        },
        visit: (state, action: PayloadAction<Landmark>) => {
            if (!state.value) return;
            state.value.markedForVisit = state.value.markedForVisit.filter(dbname => dbname !== action.payload.dbname);
            state.value.visited.push({ dbname: action.payload.dbname, time: Date.now() });
            state.value.xp += action.payload.xp;
        }
    }
});

export const { update, follow, unfollow, markForVisit, unmarkForVisit, visit } = userSlice.actions;
export default userSlice.reducer;