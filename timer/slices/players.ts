import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fakePlayers } from "./fake-players";

export type PlayersState = m.Player[];

const initialState: PlayersState = fakePlayers;

export const playersSlice = createSlice({
    name: "players",
    initialState,
    reducers: {
        register: (state, action: PayloadAction<Omit<m.Player, "id">>) => {
            return m.register(state, action.payload);
        },
        changeInfo: (state, action: PayloadAction<m.Player>) => {
            return m.changeInfo(state, action.payload);
        }
    }
});

export const { register, changeInfo } = playersSlice.actions;

export default playersSlice.reducer;
