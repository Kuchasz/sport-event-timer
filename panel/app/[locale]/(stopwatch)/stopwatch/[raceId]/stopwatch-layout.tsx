"use client";

import type { ReactNode } from "react";
import React from "react";
import "../../../../../globals.scss";
import { BottomMenu } from "../../../../../components/stopwatch/bottom-menu";
import type { TimerDispatch, TimerState } from "@set/timer/dist/store";
import { createStore } from "@set/timer/dist/store";
import { trpc } from "../../../../../trpc-core";
import type { Middleware } from "redux";
import { Provider as ReduxStoreProvider } from "react-redux";
import { ServerConnectionHandler } from "../../../../../server-connection-handler";
import { Status } from "../../../../../components/stopwatch/status";
import { uuidv4 } from "@set/utils//dist/uuid";
import { useParams, usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom, timingPointIdAtom } from "states/stopwatch-states";
import Icon from "@mdi/react";
import { mdiCloudOffOutline, mdiCogOutline } from "@mdi/js";
import { SessionProvider, useSession } from "auth/provider";
import { getConnection } from "connection";
import { TrpcProvider } from "providers";
import type { UserSession } from "auth";

const clientId = uuidv4();

let externals = {
    raceId: undefined,
    user: undefined,
    timeOffset: undefined,
    trpc: undefined,
} as { raceId?: number; user?: string; timeOffset?: number; trpc?: ReturnType<typeof trpc.useUtils>["client"] };

const postActionsMiddleware: Middleware<object, TimerState, TimerDispatch> = _ => next => action => {
    if (!getConnection) return;

    const socket = getConnection();

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (!action.__remote && socket?.OPEN) externals.trpc?.action.dispatch.mutate({ raceId: externals.raceId!, clientId, action });

    next(action);
};

const addIssuerMiddleware: Middleware<object, TimerState, TimerDispatch> = _ => next => action => {
    if (!action.__remote) {
        action.__issuer = externals.user;
        action.__issuedAt = Date.now() + (externals.timeOffset || 0);
    }

    next(action);
};

const store = createStore([addIssuerMiddleware, postActionsMiddleware], {});

const ExternalsExposer = () => {
    const [timeOffset] = useAtom(timeOffsetAtom);
    const sessionData = useSession();

    const { raceId } = useParams<{ raceId: string }>()!;

    const trpcHack = trpc.useUtils().client;

    //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    externals = { timeOffset, user: sessionData.name, raceId: parseInt(raceId), trpc: trpcHack };

    return <></>;
};

export function StopwatchLayout({ children, session }: { children: ReactNode; session: UserSession }) {
    const [connectionState] = useAtom(connectionStateAtom);
    const [timingPointId] = useAtom(timingPointIdAtom);
    const { raceId } = useParams<{ raceId: string }>()!;
    const pathname = usePathname()!;

    const isOffline = connectionState !== "connected";
    const timingPointMissing = !timingPointId;

    return (
        <SessionProvider session={session}>
            <TrpcProvider>
                <ReduxStoreProvider store={store}>
                    <ExternalsExposer />
                    <ServerConnectionHandler dispatch={store.dispatch} raceId={parseInt(raceId)} clientId={clientId}>
                        <div id="app-holder" className="flex h-full w-screen flex-col overflow-hidden bg-zinc-200 text-zinc-700">
                            <Status raceId={raceId} />
                            <div id="module-holder" className="relative h-full flex-1 flex-col overflow-y-auto">
                                {isOffline ? (
                                    <div className="flex h-full w-full items-center justify-center px-4">
                                        <div className="flex flex-col items-center">
                                            <Icon path={mdiCloudOffOutline} size={2}></Icon>
                                            <div className="text-xl font-bold">DISCONNECTED</div>
                                            <div className="font-medium">Stable internet connection required.</div>
                                            <div className="mt-8 text-center text-sm">Wait for the reconnect or restart the app.</div>
                                        </div>
                                    </div>
                                ) : timingPointMissing && !pathname.includes("config") ? (
                                    <div className="flex h-full w-full items-center justify-center px-4">
                                        <div className="flex flex-col items-center">
                                            <Icon path={mdiCogOutline} size={2}></Icon>
                                            <div className="text-xl font-semibold">CONFIG REQUIRED</div>
                                            <div className="mt-8 text-center">
                                                Stopwatch has to measure the time at a specific timing point. Choose a timing point in the
                                                configuration to make the measurements.
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
    );
}
