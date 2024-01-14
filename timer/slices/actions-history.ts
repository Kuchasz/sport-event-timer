import type { Action, UnknownAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import * as m from "../model";

export type ActionsHistoryState = m.HistoricAction[];

const initialState: ActionsHistoryState = [];

export interface IssuedAction extends Action {
    __issuer: string;
    __issuedAt: number;
    meta: {
        remote: boolean;
    };
    payload: any;
}

function isIssuedAction(action: UnknownAction) {
    return typeof action?.__issuer === "string" && typeof action?.__issuedAt === "number";
}

export const actionsHistorySlice = createSlice({
    name: "actionsHistory",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder.addMatcher(isIssuedAction, (state, action) => {
            const issuedAction = action as IssuedAction;
            return m.addHistoricAction(state, {
                action: { type: issuedAction.type, payload: issuedAction.payload },
                issuer: issuedAction.__issuer,
                issuedAt: issuedAction.__issuedAt,
            });
        }),
});

export default actionsHistorySlice.reducer;
