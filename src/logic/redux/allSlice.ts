import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '@logic/types';

export const allSlice = createSlice({
  name: 'all',
  initialState: { value: undefined as Location[] | undefined },
  reducers: {
    add: (state, action: PayloadAction<Location>) => {
        if (!state.value) state.value = [];
        state.value.push(action.payload);
    },
    update: (state, action: PayloadAction<Location[]>) => {
      state.value = action.payload;
    }
  }
});

export const { add, update } = allSlice.actions;
export default allSlice.reducer;