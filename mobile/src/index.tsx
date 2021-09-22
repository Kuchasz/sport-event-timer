import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createStore, TimerDispatch, TimerState } from "@set/timer/store";
import { Middleware } from "redux";
import { Provider } from "react-redux";
import { ServerConnectionHandler } from "./server-connection-handler";
import { socket } from "./connection";
import "./index.scss";

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = (storeApi) => (next) => (action) => {
    if (!action.__remote && socket.connected) socket.emit("post-action", action);

    next(action);
};

const store = createStore([postActionsMiddleware]);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ServerConnectionHandler dispatch={store.dispatch}>
                <App />
            </ServerConnectionHandler>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
