import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimeKeepersState = m.TimeKeeper[];

const initialState: TimeKeepersState = [];

export const timeKeepersSlice = createSlice({
    name: "timeKeepers",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Omit<m.TimeKeeper, "id">>) => m.addTimeKeeper(state, action.payload),
        remove: (state, action: PayloadAction<Pick<m.TimeKeeper, "id">>) => m.removeTimeKeeper(state, action.payload.id)
    }
});

export const { add, remove } = timeKeepersSlice.actions;

export default timeKeepersSlice.reducer;
