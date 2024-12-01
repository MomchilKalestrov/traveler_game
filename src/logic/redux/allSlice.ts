import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '@logic/types';

export const allSlice = createSlice({
  name: 'all',
  initialState: { value: undefined as Location[] | undefined },
  reducers: {
    update: (state, action: PayloadAction<Location[]>) => {
      state.value = action.payload;
    }
  }
});

export const { update } = allSlice.actions;
export default allSlice.reducer;