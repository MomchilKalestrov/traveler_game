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
      if (state.value)
        state.value.followers.push(action.payload);
    },
    unfollow: (state, action: PayloadAction<string>) => {
      if (state.value)
        state.value.followers = state.value.followers.filter(follower => follower !== action.payload);
    }
  }
});

export const { update } = userSlice.actions;
export default userSlice.reducer;