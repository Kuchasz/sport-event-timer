"use client"

import React, { ReactNode } from "react";
import "../../globals.scss";
import { BottomMenu } from "../../components/stopwatch/bottom-menu";
import { createStore, TimerDispatch, TimerState } from "@set/timer/dist/store";
import { trpc } from "../../trpc-core";
import { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { ServerConnectionHandler } from "../../server-connection-handler";
import { Status } from "../../components/stopwatch/status";
import { uuidv4 } from "@set/utils//dist/uuid";
import { useParams, usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom, timingPointIdAtom } from "states/stopwatch-states";
import Head from "next/head";
import Icon from "@mdi/react";
import { mdiCloudOffOutline, mdiCogOutline } from "@mdi/js";
import { SessionProvider, useSession } from "next-auth/react";
import { getConnection } from "connection";
import { TrpcProvider } from "providers";

const clientId = uuidv4();

let externals = {
    raceId: undefined,
    user: undefined,
    timeOffset: undefined,
    trpc: undefined,
} as { raceId?: number; user?: string; timeOffset?: number; trpc?: ReturnType<typeof trpc.useContext>["client"] };

const postActionsMiddleware: Middleware<{}, TimerState, TimerDispatch> = _ => next => action => {
    if (!getConnection) return;

    const socket = getConnection();

    if (!action.__remote && socket?.OPEN) externals.trpc?.action.dispatch.mutate({ raceId: externals.raceId!, clientId, action });

    next(action);
};

const addIssuerMiddleware: Middleware<{}, TimerState, TimerDispatch> = _ => next => action => {
    if (!action.__remote) {
        action.__issuer = externals.user;
        action.__issuedAt = Date.now() + (externals.timeOffset || 0);
    }

    next(action);
};

const store = createStore([addIssuerMiddleware, postActionsMiddleware], {});

const ExternalsExposer = () => {
    const [timeOffset] = useAtom(timeOffsetAtom);
    const { data: sessionData } = useSession();

    const { raceId } = useParams() as { raceId: string };

    const trpcHack = trpc.useContext().client;

    externals = { timeOffset, user: sessionData?.user?.name!, raceId: parseInt(raceId as string), trpc: trpcHack };

    return <></>;
};

export default function StopwatchLayout({ children }: { children: ReactNode }) {
    // const session = await auth();
    const [connectionState] = useAtom(connectionStateAtom);
    const [timingPointId] = useAtom(timingPointIdAtom);
    const { raceId } = useParams() as { raceId: string };
    const pathname = usePathname()!;

    const isOffline = connectionState !== "connected";
    const timingPointMissing = !timingPointId;

    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col text-zinc-900">
                <SessionProvider>
                    <TrpcProvider>
                        <ReduxStoreProvider store={store}>
                            <ExternalsExposer />
                            <ServerConnectionHandler dispatch={store!.dispatch} raceId={parseInt(raceId as string)} clientId={clientId}>
                                <Head>
                                    <title>Stopwatch</title>
                                    {raceId && <link key="manifest" rel="manifest" href={`/api/manifest/${raceId}/stopwatch`} />}
                                </Head>
                                <div id="app-holder" className="flex flex-col overflow-hidden bg-zinc-200 h-full w-screen text-zinc-700">
                                    <Status raceId={raceId} />
                                    <div id="module-holder" className="relative overflow-y-auto h-full flex-col flex-1">
                                        {isOffline ? (
                                            <div className="w-full h-full px-4 flex items-center justify-center">
                                                <div className="flex flex-col items-center">
                                                    <Icon path={mdiCloudOffOutline} size={2}></Icon>
                                                    <div className="text-xl font-bold">DISCONNECTED</div>
                                                    <div className="font-medium">Stable internet connection required.</div>
                                                    <div className="mt-8 text-sm text-center">
                                                         Wait for the reconnect or restart the app.
                                                    </div>
                                                </div>
                                            </div>
                                        ) : timingPointMissing && !pathname.includes("config") ? (
                                            <div className="w-full h-full px-4 flex items-center justify-center">
                                                <div className="flex flex-col items-center">
                                                    <Icon path={mdiCogOutline} size={2}></Icon>
                                                    <div className="text-xl font-semibold">CONFIG REQUIRED</div>
                                                    <div className="mt-8 text-center">
                                                        Stopwatch has to measure the time at a specific timing point. Choose a timing point
                                                        in the configuration to make the measurements.
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            children
                                        )}
                                    </div>
                                    <BottomMenu pathname={pathname} raceId={raceId} isOffline={isOffline} timingPointMissing={timingPointMissing} />
                                </div>
                            </ServerConnectionHandler>
                        </ReduxStoreProvider>
                    </TrpcProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
