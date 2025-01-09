import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '@logic/types';

export const finishedSlice = createSlice({
	name: 'finished',
	initialState: { value: undefined as Location[] | undefined },
	reducers: {
		add: (state, action: PayloadAction<Location>) => {
			if (!state.value) state.value = [];
			state.value.push(action.payload);
		},
		remove: (state, action: PayloadAction<string>) => {
			if (!state.value) {
				state.value = [];
				return;
			}
			state.value = state.value.filter((location) => location.dbname !== action.payload);
		},
		clear: (state) => {
			state.value = [];
		},
		update: (state, action: PayloadAction<Location[]>) => {
			state.value = action.payload;
		}
	}
});

export const { add, remove, clear, update } = finishedSlice.actions;
export default finishedSlice.reducer;