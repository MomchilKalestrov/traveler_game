import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@logic/types';

export const userSlice = createSlice({
  name: 'user',
  initialState: { value: undefined as User | undefined},
  reducers: {
    update: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    }
  }
});

export const { update } = userSlice.actions;
export default userSlice.reducer;