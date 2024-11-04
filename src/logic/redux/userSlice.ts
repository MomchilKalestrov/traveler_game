import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { user } from '@logic/types';

export const userSlice = createSlice({
  name: 'user',
  initialState: { value: {} },
  reducers: {
    update: (state, action: PayloadAction<user>) => {
      state.value = action.payload;
    }
  }
});

export const { update } = userSlice.actions;
export default userSlice.reducer;