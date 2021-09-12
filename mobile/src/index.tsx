import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { AppDispatch, createStore, RootState } from "@set/timer/store";
import { io } from "socket.io-client";
import { Middleware } from "redux";
import { Provider } from "react-redux";
import "./index.scss";

const socket = io("ws://wss.set-hub.pyszstudio.pl", { transports: ["websocket"] });
socket.on("connect", () => {
    console.log(socket.id);
});

socket.on("disconnect", (r) => {
    console.log("DISCONNECTED", r);
});

socket.on("receive-action", (action) => store.dispatch({ ...action, __remote: true }));

export const exampleMiddleware: Middleware<{}, RootState, AppDispatch> = (storeApi) => (next) => (action) => {
    // const state = storeApi.getState();
    console.log(action);
    if (!action.__remote && socket.connected) socket.emit("post-action", action);

    next(action);
};

const store = createStore([exampleMiddleware]);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
