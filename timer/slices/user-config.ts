import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: m.UserConfig = {
    user: undefined,
    timeKeeperId: undefined
};

export const userConfigSlice = createSlice({
    name: "userConfig",
    initialState,
    reducers: {
        chooseTimeKeeper: (state, action: PayloadAction<{ timeKeeperId: number }>) =>
            m.chooseTimeKeeper(state, action.payload.timeKeeperId),
        setUser: (state, action: PayloadAction<{ user: string }>) => m.setUser(state, action.payload.user)
    }
});

export const { chooseTimeKeeper, setUser } = userConfigSlice.actions;

export default userConfigSlice.reducer;
