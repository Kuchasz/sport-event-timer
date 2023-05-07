import React from "react";
import { AppProps } from "next/app";
import { BottomMenu } from "../components/stopwatch/bottom-menu";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { getConnection, trpc } from "../connection";
import { Login } from "../pages/login";
import { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { ServerConnectionHandler } from "../server-connection-handler";
import { Status } from "../components/stopwatch/status";
import { uuidv4 } from "@set/utils//dist/uuid";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom, timingPointIdAtom, userAtom } from "states/stopwatch-states";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Icon from "@mdi/react";
import { mdiCloudOffOutline, mdiCogOutline } from "@mdi/js";

const clientId = uuidv4();

let externals = {
    raceId: undefined,
    user: undefined,
    timeOffset: undefined,
    trpc: undefined,
} as { raceId?: number; user?: string; timeOffset?: number; trpc?: ReturnType<typeof trpc.useContext>["client"] };

export const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = _ => next => action => {
    if (!getConnection) return;

    const socket = getConnection();

    if (!action.__remote && socket?.OPEN) externals.trpc?.action.dispatch.mutate({ raceId: externals.raceId!, clientId, action });

    next(action);
};

export const addIssuerMiddleware: Middleware<{}, TimerState, TimerDispatch> = _ => next => action => {
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
    const trpcHack = trpc.useContext().client;

    externals = { user, timeOffset, raceId: parseInt(raceId as string), trpc: trpcHack };

    return <></>;
};

type StopwatchAppProps = AppProps;
const StopwatchApp = ({ Component, pageProps }: StopwatchAppProps) => {
    const { data: loggedIn } = useSession();
    const [connectionState] = useAtom(connectionStateAtom);
    const [timingPointId] = useAtom(timingPointIdAtom);
    const {
        query: { raceId },
        pathname
    } = useRouter();

    const isOffline = connectionState !== "connected";
    const timingPointMissing = !timingPointId;

    return loggedIn ? (
        <ReduxStoreProvider store={store}>
            <ExternalsExposer />
            <ServerConnectionHandler dispatch={store!.dispatch} raceId={parseInt(raceId as string)} clientId={clientId}>
                <Head>
                    <title>Stopwatch</title>
                    <link key="manifest" rel="manifest" href="/favicon/stopwatch.webmanifest" />
                </Head>
                <div id="app-holder" className="flex flex-col overflow-hidden bg-zinc-200 h-full w-screen text-zinc-700">
                    <Status />
                    <div id="module-holder" className="relative overflow-y-auto h-full flex-col flex-1">
                        {isOffline ? (
                            <div className="w-full h-full px-4 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <Icon path={mdiCloudOffOutline} size={2}></Icon>
                                    <div className="text-xl font-semibold">APP IS OFFLINE</div>
                                    <div className="mt-8 text-center">Stopwatch requires stable internet connection. Wait for the app to reconnect itself or kill the app and try to run it again.</div>
                                </div>
                            </div>
                        ) : (timingPointMissing && !pathname.includes('config')) ? (
                            <div className="w-full h-full px-4 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <Icon path={mdiCogOutline} size={2}></Icon>
                                    <div className="text-xl font-semibold">CONFIG REQUIRED</div>
                                    <div className="mt-8 text-center">Stopwatch has to measure the time at a specific timing point. Choose a timing point in the configuration to make the measurements.</div>
                                </div>
                            </div>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </div>
                    <BottomMenu isOffline={isOffline} timingPointMissing={timingPointMissing} />
                </div>
            </ServerConnectionHandler>
        </ReduxStoreProvider>
    ) : (
        <Login />
    );
};

export default StopwatchApp;
