import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Landmark } from '@logic/types';

export const landmarksMarkedForVisitSlice = createSlice({
  name: 'landmarksMarkedForVisit',
  initialState: { value: undefined as Landmark[] | undefined },
  reducers: {
    add: (state, action: PayloadAction<Landmark>) => {
      if (!state.value) state.value = [];
      state.value.push(action.payload);
    },
    remove: (state, action: PayloadAction<string>) => {
      if (!state.value) {
        state.value = [];
        return;
      }
      state.value = state.value.filter((landmark) => landmark.dbname !== action.payload);
    },
    clear: (state) => {
      state.value = [];
    },
    update: (state, action: PayloadAction<Landmark[]>) => {
      state.value = action.payload;
    }
  }
});

export const { add, remove, clear, update } = landmarksMarkedForVisitSlice.actions;
export default landmarksMarkedForVisitSlice.reducer;