import * as m from "../model";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type TimeStampsState = m.TimeStamp[];

const initialState: TimeStampsState = [];

export const timeStampsSlice = createSlice({
    name: "timeStamps",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Omit<m.TimeStamp, "id">>) => m.addTimeStamp(state, action.payload),
        assign: (state, action: PayloadAction<Partial<m.TimeStamp>>) => m.updateTimeStamp(state, action.payload),
        reassign: (state, action: PayloadAction<Partial<m.TimeStamp>>) => m.updateTimeStamp(state, action.payload),
        tweakTimeStamp: (state, action: PayloadAction<m.TimeStamp>) => m.updateTimeStamp(state, action.payload),
        reset: (state, action: PayloadAction<Pick<m.TimeStamp, "id">>) => m.resetTimeStamp(state, action.payload.id),
    },
});

export const { add, reset, tweakTimeStamp, assign, reassign } = timeStampsSlice.actions;

export default timeStampsSlice.reducer;
