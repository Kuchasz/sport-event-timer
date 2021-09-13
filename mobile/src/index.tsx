import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { AppDispatch, createStore, RootState } from "@set/timer/store";
import { Middleware } from "redux";
import { Provider } from "react-redux";
import { socket } from "./connection";
import "./index.scss";

socket.on("receive-action", (action) => store.dispatch({ ...action, __remote: true }));

export const postActionsMiddleware: Middleware<{}, RootState, AppDispatch> = (storeApi) => (next) => (action) => {
    if (!action.__remote && socket.connected) socket.emit("post-action", action);

    next(action);
};

const store = createStore([postActionsMiddleware]);

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
