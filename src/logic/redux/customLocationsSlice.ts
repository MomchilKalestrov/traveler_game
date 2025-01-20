import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityLocation } from '@logic/types';

export const customSlice = createSlice({
  name: 'custom',
  initialState: { value: undefined as CommunityLocation[] | undefined },
  reducers: {
    remove: (state, action: PayloadAction<string>) => {
        if (!state.value) return;
        const index = state.value.findIndex((location) => location.name === action.payload);
        if (index === -1) return;
        state.value.splice(index, 1);
    },
    add: (state, action: PayloadAction<CommunityLocation>) => {
        if (!state.value) state.value = [];
        state.value.push(action.payload);
    },
    update: (state, action: PayloadAction<CommunityLocation[]>) => {
      state.value = action.payload;
    }
  }
});

export const { remove, add, update } = customSlice.actions;
export default customSlice.reducer;