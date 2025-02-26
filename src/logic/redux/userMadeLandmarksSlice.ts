import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityLandmark } from '@logic/types';

export const userMadeLandmarksSlice = createSlice({
  name: 'userMadeLandmarks',
  initialState: { value: undefined as CommunityLandmark[] | undefined },
  reducers: {
    remove: (state, action: PayloadAction<string>) => {
        if (!state.value) return;
        const index = state.value.findIndex((landmark) => landmark.name === action.payload);
        if (index === -1) return;
        state.value.splice(index, 1);
    },
    add: (state, action: PayloadAction<CommunityLandmark>) => {
        if (!state.value) state.value = [];
        state.value.push(action.payload);
    },
    update: (state, action: PayloadAction<CommunityLandmark[]>) => {
      state.value = action.payload;
    }
  }
});

export const { remove, add, update } = userMadeLandmarksSlice.actions;
export default userMadeLandmarksSlice.reducer;