import React from "react";
import { AppProps } from "next/app";
import { BottomMenu } from "../components/stopwatch/bottom-menu";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getConnection, trpcClient } from "../connection";
import { Login } from "../pages/login";
import { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServerConnectionHandler } from "../server-connection-handler";
import { Status } from "../components/stopwatch/status";
import { uuidv4 } from "@set/utils//dist/uuid";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom, userAtom } from "stopwatch-states";
import Head from "next/head";
import { useSession } from "next-auth/react";

const clientId = uuidv4();

let externals = {
    tokenExpire: undefined,
    raceId: undefined,
    user: undefined,
    timeOffset: undefined,
} as { tokenExpire?: number; raceId?: number; user?: string; timeOffset?: number };

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = (_) => (next) => (action) => {
    if (!getConnection) return;

    const socket = getConnection();

    if (!action.__remote && socket?.OPEN) trpcClient.action.dispatch.mutate({ raceId: externals.raceId!, clientId, action });

    next(action);
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
    const [timeOffset] = useAtom(timeOffsetAtom);
    const [user] = useAtom(userAtom);
    const {
        query: { raceId },
    } = useRouter();

    externals = { user, timeOffset, raceId: parseInt(raceId as string) };

    return <></>;
};

type StopwatchAppProps = AppProps & { queryClient: QueryClient };
const StopwatchApp = ({ Component, pageProps, queryClient }: StopwatchAppProps) => {
    const { data: loggedIn } = useSession();
    const [connectionState] = useAtom(connectionStateAtom);
    const {
        query: { raceId },
    } = useRouter();
    
    const isOffline = connectionState !== "connected";

    return loggedIn ? (
        <ReduxStoreProvider store={store}>
            <ExternalsExposer />
            <QueryClientProvider client={queryClient}>
                <ServerConnectionHandler dispatch={store!.dispatch} raceId={parseInt(raceId as string)} clientId={clientId}>
                    <Head>
                        <title>Stopwatch</title>
                        <link key="manifest" rel="manifest" href="/favicon/stopwatch.webmanifest" />
                    </Head>
                    <div id="app-holder" className="flex flex-col overflow-hidden bg-zinc-200 h-full w-screen text-zinc-700">
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

                        <BottomMenu />
                    </div>
                </ServerConnectionHandler>
            </QueryClientProvider>
        </ReduxStoreProvider>
    ) : (
        <Login />
    );
};

export default StopwatchApp;
