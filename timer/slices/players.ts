import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlayersState = m.Player[];

const initialState: PlayersState = [];

export const playersSlice = createSlice({
    name: "players",
    initialState,
    reducers: {
        register: (state, action: PayloadAction<Omit<m.Player, "id">>) => m.registerPlayer(state, action.payload),
        changeInfo: (state, action: PayloadAction<m.Player>) => m.changePlayerInfo(state, action.payload),
        upload: (state, action: PayloadAction<m.Player[]>) => m.uploadPlayers(state, action.payload)
    }
});

export const { register, changeInfo, upload } = playersSlice.actions;

export default playersSlice.reducer;
