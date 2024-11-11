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
    }
  }
});

export const { update } = userSlice.actions;
export default userSlice.reducer;