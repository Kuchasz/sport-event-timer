import * as m from "../model";
import { Action, AnyAction, createSlice } from "@reduxjs/toolkit";

export type ActionsHistoryState = m.HistoricAction[];

const initialState: ActionsHistoryState = [];

interface LocalAction extends Action {}

function isLocalAction(action: AnyAction): action is LocalAction {
    return !action.__remote;
    //return action.type.endsWith('rejected')
}

export const actionsHistorySlice = createSlice({
    name: "actionsHistory",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addMatcher(isLocalAction, (state, action) => {
                console.log(state, action);
                return m.addHistoricAction(state, { type: action.type, issuer: "test" });
            })
            .addDefaultCase((state, action) => state)
});

export default actionsHistorySlice.reducer;
