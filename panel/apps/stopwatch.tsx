import React from "react";
import { AppProps } from "next/app";
import { BottomMenu } from "../components/stopwatch/bottom-menu";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getConnection, queryClient, trpcClient } from "../connection";
import { isLoggedIn } from "../security";
import { Login } from "../pages/login";
import { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ServerConnectionHandler } from "../server-connection-handler";
import { Status } from "../components/stopwatch/status";
import { timeKeeperConfigSlice } from "@set/timer/dist/slices/time-keeper-config";
import { trpc } from "../trpc";
import { userConfigSlice } from "@set/timer/dist/slices/user-config";
import { useTimerDispatch, useTimerSelector } from "../hooks";
import { uuidv4 } from "@set/shared/dist";
// import { add, reset, tweakTimeStamp } from "@set/timer/dist/slices/time-stamps";
// import { Config } from "./stopwatch/config";
// import { getCurrentTime } from "@set/shared/utils";
// import { History } from "./stopwatch/history";
// import { PlayersAssignTime } from "../components/stopwatch/players-assign-time";
// import { PlayersDialPad } from "../components/stopwatch/players-dial-pad";
// import { PlayersList } from "../components/stopwatch/players-list";
// import { PlayersReassignTime } from "./stopwatch/players-reassign-time";
// import { PlayersTimes } from "./stopwatch/players-times";
// import { sort } from "@set/shared/dist";
// import { TweakTimeStamps } from "./stopwatch/tweak-time-stamp";

const clientId = uuidv4();

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = storeApi => next => action => {
    if (!isLoggedIn(storeApi.getState().userConfig.tokenExpire)) {
        next(action);
        return;
    } else {
        if(!getConnection)
        return;

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
    localStorage?.setItem("state.config", configState);
};

const stateString = localStorage.getItem("state.config");
const store = createStore([persistStateMiddleware, addIssuerMiddleware, postActionsMiddleware], {
    userConfig: JSON.parse(stateString || "{}")
});

type StopwatchAppProps = AppProps & { queryClient: QueryClient; trpcClient: any };
export const StopwatchApp = ({ Component, pageProps, queryClient, trpcClient }: StopwatchAppProps) => {
    // const loggedIn = useTimerSelector(x => isLoggedIn(x.userConfig.tokenExpire));
    // const isOffline = useTimerSelector(x => x.timeKeeperConfig?.connectionState !== "connected");
    const loggedIn = true;
    const isOffline = true;
    return (
        <ReduxStoreProvider store={store}>
            {loggedIn ? (
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        <ServerConnectionHandler dispatch={store!.dispatch} clientId={clientId}>
                            <div
                                id="app-holder"
                                className="flex flex-col overflow-hidden bg-zinc-800 h-full w-screen text-white"
                            >
                                <Status />
                                <div id="module-holder" className="relative overflow-hidden flex-col flex-1">
                                    <div className="h-full flex-1 overflow-y-scroll">
                                        {isOffline ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="flex-col">
                                                    <div className="text-4xl font-semibold">APP IS OFFLINE ::SAD::</div>
                                                    <div className="">
                                                        Wait for the app to reconnect or kill the app and run it again
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Component {...pageProps} />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <BottomMenu />
                                </div>
                            </div>
                        </ServerConnectionHandler>
                    </QueryClientProvider>
                </trpc.Provider>
            ) : (
                <Login />
            )}
        </ReduxStoreProvider>
    );
};

export default StopwatchApp;
