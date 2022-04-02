import * as m from "../model";
import { Action, AnyAction, createSlice } from "@reduxjs/toolkit";

export type ActionsHistoryState = m.HistoricAction[];

const initialState: ActionsHistoryState = [];

interface IssuedAction extends Action {
    __issuer: string;
    __issuedAt: number;
}

function isIssuedAction(action: AnyAction): action is IssuedAction {
    return !action.__remote && action.__issuer && action.__issuedAt;
}

export const actionsHistorySlice = createSlice({
    name: "actionsHistory",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addMatcher(isIssuedAction, (state, action) => {
                return m.addHistoricAction(state, {
                    type: action.type,
                    issuer: action.__issuer,
                    issuedAt: action.__issuedAt
                });
            })
            .addDefaultCase((state, _) => state)
});

export default actionsHistorySlice.reducer;
