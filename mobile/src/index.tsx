import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getUser, isLoggedIn } from "./security";
import { LoginApp } from "./login-app";
import { Middleware } from "redux";
import { Provider as ReduxStoreProdiver } from "react-redux";
import { ServerConnectionHandler } from "./server-connection-handler";
import { socket } from "./connection";
import { useState } from "react";
import "./index.scss";

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = (storeApi) => (next) => (action) => {
    console.log(action);
    if (!action.__remote && socket.connected) socket.emit("post-action", action);

    next(action);
};

export const addIssuerMiddleware: (issuer: string) => Middleware<{}, TimerState, TimerDispatch> =
    (issuer) => (_) => (next) => (action) => {
        if (!action.__remote) action.__issuer = issuer;

        next(action);
    };

const LoggedApp = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    const store = createStore([addIssuerMiddleware(getUser()), postActionsMiddleware]);
    return loggedIn ? (
        <ReduxStoreProdiver store={store}>
            <ServerConnectionHandler dispatch={store.dispatch}>
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
