import * as m from "../model";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type SplitTimesState = m.SplitTime[];

const initialState: SplitTimesState = [];

export const splitTimesSlice = createSlice({
    name: "split-times",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Omit<m.SplitTime, "id">>) => m.addSplitTime(state, action.payload),
        assign: (state, action: PayloadAction<Partial<m.SplitTime>>) => m.updateSplitTime(state, action.payload),
        reassign: (state, action: PayloadAction<Partial<m.SplitTime>>) => m.updateSplitTime(state, action.payload),
        tweak: (state, action: PayloadAction<m.SplitTime>) => m.updateSplitTime(state, action.payload),
        reset: (state, action: PayloadAction<Pick<m.SplitTime, "id">>) => m.resetSplitTime(state, action.payload.id),
    },
});

export const { add, reset, tweak, assign, reassign } = splitTimesSlice.actions;

export default splitTimesSlice.reducer;
