import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: m.TimeKeeperConfig = {
    user: undefined,
    isOffline: false,
    timeKeeperId: undefined,
    timeOffset: undefined
};

export const timeKeeperConfigSlice = createSlice({
    name: "timeKeeperConfig",
    initialState,
    reducers: {
        chooseTimeKeeper: (state, action: PayloadAction<{ timeKeeperId: number }>) =>
            m.chooseTimeKeeper(state, action.payload.timeKeeperId),
        setIsOffline: (state, action: PayloadAction<{ isOffline: boolean }>) =>
            m.setIsOffline(state, action.payload.isOffline),
        setTimeOffset: (state, action: PayloadAction<{ timeOffset: number }>) =>
            m.setTimeOffset(state, action.payload.timeOffset),
        setUser: (state, action: PayloadAction<{ user: string }>) => m.setUser(state, action.payload.user)
    }
});

export const { chooseTimeKeeper, setIsOffline, setTimeOffset } = timeKeeperConfigSlice.actions;

export default timeKeeperConfigSlice.reducer;
