import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { location } from '@logic/types';

export const newSlice = createSlice({
  name: 'new',
  initialState: { value: undefined as location[] | undefined },
  reducers: {
    addNew: (state, action: PayloadAction<location>) => {
      if (!state.value) state.value = [];
      state.value.push(action.payload);
    },
    removeNew: (state, action: PayloadAction<string>) => {
      if (!state.value) {
        state.value = [];
        return;
      }
      state.value = state.value.filter((location) => location.name !== action.payload);
    },
    clearNew: (state) => {
      state.value = [];
    },
    updateNew: (state, action: PayloadAction<location[]>) => {
      state.value = action.payload;
    }
  }
});

export const { addNew, removeNew, clearNew, updateNew } = newSlice.actions;
export default newSlice.reducer;