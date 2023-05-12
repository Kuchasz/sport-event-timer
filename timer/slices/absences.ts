import * as m from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AbsenceState = m.Absence[];

const initialState: AbsenceState = [];

export const absencesSlice = createSlice({
    name: "absences",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Omit<m.Absence, "id">>) => m.addAbsence(state, action.payload),
        reset: (state, action: PayloadAction<Pick<m.Absence, "id">>) => m.resetAbsence(state, action.payload.id)
    }
});

export const { add, reset } = absencesSlice.actions;

export default absencesSlice.reducer;
