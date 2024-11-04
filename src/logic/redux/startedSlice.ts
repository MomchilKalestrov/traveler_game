import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { location } from '@logic/types';

export const startedSlice = createSlice({
  name: 'started',
  initialState: { value: undefined as location[] | undefined },
  reducers: {
    addStarted: (state, action: PayloadAction<location>) => {
      if (!state.value) state.value = [];
      state.value.push(action.payload);
    },
    removeStarted: (state, action: PayloadAction<string>) => {
      if (!state.value) {
        state.value = [];
        return;
      }
      state.value = state.value.filter((location) => location.name !== action.payload);
    },
    clearStarted: (state) => {
      state.value = [];
    },
    updateStarted: (state, action: PayloadAction<location[]>) => {
      state.value = action.payload;
    }
  }
});

export const { addStarted, removeStarted, clearStarted, updateStarted } = startedSlice.actions;
export default startedSlice.reducer;