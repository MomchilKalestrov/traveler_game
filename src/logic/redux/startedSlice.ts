import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { location } from '@logic/types';

interface StartedState {
  value: location[];
}

const initialState: StartedState = {
  value: []
};

export const startedSlice = createSlice({
  name: 'started',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<location>) => {
      state.value.push(action.payload);
    },
    remove: (state, action: PayloadAction<string>) => {
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

export const { add, remove, clear, update } = startedSlice.actions;
export default startedSlice.reducer;