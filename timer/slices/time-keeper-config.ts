import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: m.TimeKeeperConfig = {
    connectionState: "disconnected",
    timeOffset: undefined
};

export const timeKeeperConfigSlice = createSlice({
    name: "timeKeeperConfig",
    initialState,
    reducers: {
        setConnectionState: (state, action: PayloadAction<{ connectionState: m.ConnectionState }>) =>
            m.setConnectionState(state, action.payload.connectionState),
        setTimeOffset: (state, action: PayloadAction<{ timeOffset: number }>) =>
            m.setTimeOffset(state, action.payload.timeOffset)
    }
});

export const { setConnectionState, setTimeOffset } = timeKeeperConfigSlice.actions;

export default timeKeeperConfigSlice.reducer;
