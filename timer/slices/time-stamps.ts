import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimeStampsState = m.TimeStamp[];

const initialState: TimeStampsState = [];

export const timeStampsSlice = createSlice({
    name: "timeStamps",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Omit<m.TimeStamp, "id">>) => {
            return m.addTimeStamp(state, action.payload);
        },
        assignPlayer: (state, action: PayloadAction<Pick<m.TimeStamp, "id" | "playerId">>) => {
            return m.assignPlayer(state, action.payload);
        },
        reset: (state, action: PayloadAction<Pick<m.TimeStamp, "id">>) => {
            return m.resetTimeStamp(state, action.payload.id);
        }
    }
});

export const { add, reset, assignPlayer } = timeStampsSlice.actions;

export default timeStampsSlice.reducer;