import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: m.TimeKeeperConfig = {
    isOffline: false,
    timeOffset: undefined
};

export const timeKeeperConfigSlice = createSlice({
    name: "timeKeeperConfig",
    initialState,
    reducers: {
        setIsOffline: (state, action: PayloadAction<{ isOffline: boolean }>) =>
            m.setIsOffline(state, action.payload.isOffline),
        setTimeOffset: (state, action: PayloadAction<{ timeOffset: number }>) =>
            m.setTimeOffset(state, action.payload.timeOffset)
    }
});

export const { setIsOffline, setTimeOffset } = timeKeeperConfigSlice.actions;

export default timeKeeperConfigSlice.reducer;
