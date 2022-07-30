import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getConnection, queryClient, trpcClient } from "./connection";
import { isLoggedIn } from "./security";
import { LoginApp } from "./login-app";
import { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { QueryClientProvider } from "react-query";
import { ServerConnectionHandler } from "./server-connection-handler";
import { timeKeeperConfigSlice } from "@set/timer/dist/slices/time-keeper-config";
import { trpc } from "./trpc";
import { userConfigSlice } from "@set/timer/dist/slices/user-config";
import { useTimerSelector } from "./hooks";
import { uuidv4 } from "@set/shared/dist";
import "./index.scss";

const clientId = uuidv4();

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = storeApi => next => action => {
    if (!isLoggedIn(storeApi.getState().userConfig.tokenExpire)) {
        next(action);
        return;
    } else {
        const socket = getConnection();

        if (
            !action.__remote &&
            socket?.OPEN &&
            !action.type.includes(timeKeeperConfigSlice.name) &&
            !action.type.includes(userConfigSlice.name)
        )
            trpcClient.mutation("action.dispatch", { action, clientId });

        next(action);
    }
};

export const addIssuerMiddleware: Middleware<{}, TimerState, TimerDispatch> = state => next => action => {
    if (
        !action.__remote &&
        !action.type.includes(timeKeeperConfigSlice.name) &&
        !action.type.includes(userConfigSlice.name)
    ) {
        action.__issuer = state.getState().userConfig.user;
        action.__issuedAt = Date.now() + (state.getState().timeKeeperConfig?.timeOffset || 0);
    }

    next(action);
};

export const persistStateMiddleware: Middleware<{}, TimerState, TimerDispatch> = storeApi => next => action => {
    next(action);
    const config = storeApi.getState().userConfig;
    const configState = JSON.stringify(config);
    localStorage.setItem("state.config", configState);
};

const LoggedApp = () => {
    const loggedIn = useTimerSelector(x => isLoggedIn(x.userConfig.tokenExpire));

    return loggedIn ? (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ServerConnectionHandler dispatch={store!.dispatch} clientId={clientId}>
                    <App />
                </ServerConnectionHandler>
            </QueryClientProvider>
        </trpc.Provider>
    ) : (
        <LoginApp />
    );
};

const stateString = localStorage.getItem("state.config");
const store = createStore([persistStateMiddleware, addIssuerMiddleware, postActionsMiddleware], {
    userConfig: JSON.parse(stateString || "{}")
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    // <React.StrictMode>
    <ReduxStoreProvider store={store}>
        <LoggedApp />
    </ReduxStoreProvider>
    // </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
