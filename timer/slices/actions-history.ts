import * as m from "../model";
import type { Action, AnyAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type ActionsHistoryState = m.HistoricAction[];

const initialState: ActionsHistoryState = [];

interface IssuedAction extends Action {
    __issuer: string;
    __issuedAt: number;
    meta: {
        remote: boolean;
    };
    payload: any;
}

function isIssuedAction(action: AnyAction): action is IssuedAction {
    return !action?.meta?.remote && typeof action?.__issuer === "string" && typeof action?.__issuedAt === "number";
}

export const actionsHistorySlice = createSlice({
    name: "actionsHistory",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addMatcher(isIssuedAction, (state, action) => {
                return m.addHistoricAction(state, {
                    action: { type: action.type, payload: action.payload },
                    issuer: action.__issuer,
                    issuedAt: action.__issuedAt,
                });
            })
            .addDefaultCase((state, _) => state),
});

export default actionsHistorySlice.reducer;
