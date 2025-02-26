import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Landmark } from '@logic/types';

export const allLandmarksSlice = createSlice({
  name: 'allLandmarks',
  initialState: { value: undefined as Landmark[] | undefined },
  reducers: {
    add: (state, action: PayloadAction<Landmark>) => {
        if (!state.value) state.value = [];
        state.value.push(action.payload);
    },
    update: (state, action: PayloadAction<Landmark[]>) => {
      state.value = action.payload;
    }
  }
});

export const { add, update } = allLandmarksSlice.actions;
export default allLandmarksSlice.reducer;