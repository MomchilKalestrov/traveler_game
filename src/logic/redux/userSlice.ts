import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { user } from '@logic/types';

export const userSlice = createSlice({
  name: 'user',
  initialState: { value: undefined as user | undefined},
  reducers: {
    updateUser: (state, action: PayloadAction<user>) => {
      state.value = action.payload;
    }
  }
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;