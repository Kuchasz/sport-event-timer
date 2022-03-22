import App from "./App";
import Icon from "@mdi/react";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { isLoggedIn } from "./security";
import { logIn, UserCredentials } from "./api";
import { mdiAccount, mdiAccountOutline, mdiLockOutline } from "@mdi/js";
import { Middleware } from "redux";
import { Provider as ReduxStoreProdiver } from "react-redux";
import { ServerConnectionHandler } from "./server-connection-handler";
import { socket } from "./connection";
import { useState } from "react";
import "./index.scss";

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = (storeApi) => (next) => (action) => {
    if (!action.__remote && socket.connected) socket.emit("post-action", action);

    next(action);
};

const store = createStore([postActionsMiddleware]);

const loggedIn = isLoggedIn();

const LoginApp = () => {
    const [loginState, setLoginState] = useState<UserCredentials>({ login: "", password: "" });

    return (
        <div className="h-full w-full flex items-center bg-gradient-to-r from-red-500 to-orange-500">
            <div className="flex flex-col grow px-12">
                <div className="my-2 shadow-xl ">
                    <label className="text-xs text-white font-semibold">LOGIN</label>
                    <div className="bg-white rounded-xl flex">
                        <Icon size={1} path={mdiAccountOutline} className="text-red-500 m-3" />
                        <input
                            className="focus:outline-none"
                            onChange={(e) => setLoginState({ ...loginState, login: e.target.value })}
                        />
                    </div>
                </div>
                <div className="my-2 shadow-xl ">
                    <label className="text-xs text-white font-semibold">PASSWORD</label>
                    <div className="bg-white rounded-xl flex">
                        <Icon size={1} path={mdiLockOutline} className="text-red-500 m-3" />
                        <input
                            className="focus:outline-none"
                            onChange={(e) => setLoginState({ ...loginState, password: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    onClick={() => logIn(loginState)}
                    className="py-3 px-12 mt-10 text-xs rounded-full my-2 bg-orange-500 text-white font-semibold uppercase self-start shadow-xl"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        {loggedIn ? (
            <ReduxStoreProdiver store={store}>
                <ServerConnectionHandler dispatch={store.dispatch}>
                    <App />
                </ServerConnectionHandler>
            </ReduxStoreProdiver>
        ) : (
            <LoginApp />
        )}
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
