import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimeKeepersState = m.TimeKeeper[];

const initialState: TimeKeepersState = [];

export const timeKeepersSlice = createSlice({
    name: "timeKeepers",
    initialState,
    reducers: {
        // add: (state, action: PayloadAction<Omit<m.TimeKeeper, "id">>) => m.addTimeKeeper(state, action.payload),
        add: (state, action: PayloadAction<m.TimeKeeper>) => m.addTimeKeeper(state, action.payload),
        remove: (state, action: PayloadAction<Pick<m.TimeKeeper, "id">>) => m.removeTimeKeeper(state, action.payload.id)
    }
});

export const { add, remove } = timeKeepersSlice.actions;

export const staticTimeKeppers = [
    {
        id: 0,
        name: "Start",
        type: "start"
    },
    {
        id: 1,
        name: "Meta",
        type: "end"
    }
] as m.TimeKeeper[];

export default timeKeepersSlice.reducer;
