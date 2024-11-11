import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@logic/types';

export const userSlice = createSlice({
  name: 'user',
  initialState: { value: undefined as User | undefined},
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
    track: (state, action: PayloadAction<string>) => {
      if (!state.value) return;
      state.value.started.push(action.payload);
    },
    untrack: (state, action: PayloadAction<string>) => {
      if (!state.value) return;
      state.value.started = state.value.started.filter(name => name !== action.payload);
    },
    finish: (state, action: PayloadAction<string>) => {
      if (!state.value) return;
      state.value.started = state.value.started.filter(name => name !== action.payload);
      state.value.finished.push({ location: action.payload, time: Date.now() });
    }
  }
});

export default userSlice.reducer;