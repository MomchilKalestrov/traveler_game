import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { location } from '@logic/types';

export const newSlice = createSlice({
  name: 'new',
  initialState: { value: undefined as location[] | undefined },
  reducers: {
    add: (state, action: PayloadAction<location>) => {
      if (!state.value) state.value = [];
      state.value.push(action.payload);
    },
    remove: (state, action: PayloadAction<string>) => {
      if (!state.value) {
        state.value = [];
        return;
      }
      state.value = state.value.filter((location) => location.name !== action.payload);
    },
    clear: (state) => {
      state.value = [];
    },
    update: (state, action: PayloadAction<location[]>) => {
      state.value = action.payload;
    }
  }
});

export const { add, remove, clear, update } = newSlice.actions;
export default newSlice.reducer;