import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RaceCategoriesState = m.RaceCategory[];

const initialState: RaceCategoriesState = [];

export const raceCategoriesSlice = createSlice({
    name: "raceCategories",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Omit<m.RaceCategory, "id">>) => m.addRaceCategory(state, action.payload),
        remove: (state, action: PayloadAction<Pick<m.RaceCategory, "id">>) =>
            m.removeRaceCategory(state, action.payload.id)
    }
});

export const { add, remove } = raceCategoriesSlice.actions;

export default raceCategoriesSlice.reducer;
