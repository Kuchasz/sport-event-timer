import React from "react";
import { AppProps } from "next/app";
import { BottomMenu } from "../components/stopwatch/bottom-menu";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getConnection, trpcClient } from "../connection";
import { isLoggedIn } from "../security";
import { Login } from "../pages/login";
import { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ServerConnectionHandler } from "../server-connection-handler";
import { Status } from "../components/stopwatch/status";
import { trpc } from "../trpc";
import { uuidv4 } from "@set/shared/dist";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom, tokenExpireAtom, userAtom } from "stopwatch-states";

const clientId = uuidv4();

let externals = {
    tokenExpire: undefined,
    raceId: undefined,
    user: undefined,
    timeOffset: undefined,
} as { tokenExpire?: number; raceId?: number; user?: string; timeOffset?: number };

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = (_) => (next) => (action) => {
    if (!isLoggedIn(externals.tokenExpire)) {
        next(action);
        return;
    } else {
        if (!getConnection) return;

        const socket = getConnection();

        if (!action.__remote && socket?.OPEN) trpcClient.mutation("action.dispatch", { raceId: externals.raceId!, clientId, action });

        next(action);
    }
};

export const addIssuerMiddleware: Middleware<{}, TimerState, TimerDispatch> = (_) => (next) => (action) => {
    if (!action.__remote) {
        action.__issuer = externals.user;
        action.__issuedAt = Date.now() + (externals.timeOffset || 0);
    }

    next(action);
};

const store = createStore([addIssuerMiddleware, postActionsMiddleware], {});

const ExternalsExposer = () => {
    const [tokenExpire] = useAtom(tokenExpireAtom);
    const [timeOffset] = useAtom(timeOffsetAtom);
    const [user] = useAtom(userAtom);
    const {
        query: { raceId },
    } = useRouter();

    externals = { tokenExpire, user, timeOffset, raceId: parseInt(raceId as string) };

    return <></>;
};

type StopwatchAppProps = AppProps & { queryClient: QueryClient; trpcClient: any };
const StopwatchApp = ({ Component, pageProps, queryClient, trpcClient }: StopwatchAppProps) => {
    const [tokenExpire] = useAtom(tokenExpireAtom);
    const [connectionState] = useAtom(connectionStateAtom);
    const {
        query: { raceId },
    } = useRouter();
    const loggedIn = isLoggedIn(tokenExpire);
    const isOffline = connectionState !== "connected";

    return loggedIn ? (
        <ReduxStoreProvider store={store}>
            <ExternalsExposer />
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <ServerConnectionHandler dispatch={store!.dispatch} raceId={parseInt(raceId as string)} clientId={clientId}>
                        <div id="app-holder" className="flex flex-col overflow-hidden bg-zinc-800 h-full w-screen text-white">
                            <Status />
                            <div id="module-holder" className="relative overflow-y-auto h-full flex-col flex-1">
                                {isOffline ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="flex-col">
                                            <div className="text-xl font-semibold">APP IS OFFLINE</div>
                                            <div className="">Wait for the app to reconnect or kill the app and run it again</div>
                                        </div>
                                    </div>
                                ) : (
                                    <Component {...pageProps} />
                                )}
                            </div>
                            <div>
                                <BottomMenu />
                            </div>
                        </div>
                    </ServerConnectionHandler>
                </QueryClientProvider>
            </trpc.Provider>
        </ReduxStoreProvider>
    ) : (
        <Login />
    );
};

export default StopwatchApp;
