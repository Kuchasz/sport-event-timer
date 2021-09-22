import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createStore, TimerDispatch, TimerState } from "@set/timer/store";
import { Middleware } from "redux";
import { Provider } from "react-redux";
import { socket } from "./connection";
import { TimeOffsetContext } from "./contexts/time-offset";
import "./index.scss";

let timeOffset = 0;

socket.on("receive-action", (action) => store.dispatch({ ...action, __remote: true }));
socket.on("receive-state", (state) => store.dispatch({ type: "REPLACE_STATE", state, __remote: true }));
socket.on("sync-time", (time) => {
    timeOffset = Date.now() - time;
    console.log("timeOffset: ", timeOffset, "ms");
});
export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = (storeApi) => (next) => (action) => {
    if (!action.__remote && socket.connected) socket.emit("post-action", action);

    next(action);
};

const store = createStore([postActionsMiddleware]);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <TimeOffsetContext.Provider value={{ offset: timeOffset }}>
                <App />
            </TimeOffsetContext.Provider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
