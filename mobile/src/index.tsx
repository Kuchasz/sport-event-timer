import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getConnection } from "./connection";
import { getUser, isLoggedIn } from "./security";
import { LoginApp } from "./login-app";
import { Middleware } from "redux";
import { Provider as ReduxStoreProdiver } from "react-redux";
import { ServerConnectionHandler } from "./server-connection-handler";
import { timeKeeperConfigSlice } from "@set/timer/dist/slices/time-keeper-config";
import { useState } from "react";
import "./index.scss";

export const postActionsMiddleware: () => Middleware<{}, TimerState, TimerDispatch> = () => {
    const socket = getConnection();
    return (storeApi) => (next) => (action) => {
        if (!action.__remote && socket.connected && !action.type.includes(timeKeeperConfigSlice.name))
            socket.emit("post-action", action);

        next(action);
    };
};

export const addIssuerMiddleware: (issuer: string) => Middleware<{}, TimerState, TimerDispatch> =
    (issuer) => (state) => (next) => (action) => {
        if (!action.__remote && !action.type.includes(timeKeeperConfigSlice.name)) action.__issuer = issuer;
        action.__issuedAt = Date.now() + (state.getState().timeKeeperConfig?.timeOffset || 0);

        next(action);
    };

export const persistStateMiddleware: Middleware<{}, TimerState, TimerDispatch> = (storeApi) => (next) => (action) => {
    next(action);
    const config = storeApi.getState().timeKeeperConfig;
    console.log(action.type, config);
    const configState = JSON.stringify(config);
    localStorage.setItem("state.config", configState);
};

const LoggedApp = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    const stateString = localStorage.getItem("state.config");
    const store = loggedIn
        ? createStore([persistStateMiddleware, addIssuerMiddleware(getUser()), postActionsMiddleware()], {
              timeKeeperConfig: JSON.parse(stateString || "")
          })
        : undefined;
    return loggedIn ? (
        <ReduxStoreProdiver store={store!}>
            <ServerConnectionHandler dispatch={store!.dispatch}>
                <App />
            </ServerConnectionHandler>
        </ReduxStoreProdiver>
    ) : (
        <LoginApp onLoggedIn={() => setLoggedIn(true)} />
    );
};

ReactDOM.render(
    <React.StrictMode>
        <LoggedApp />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
