"use client";

import { mdiCloudOffOutline, mdiCogOutline } from "@mdi/js";
import Icon from "@mdi/react";
import type { TimerDispatch, TimerState } from "@set/timer/dist/store";
import { createStore } from "@set/timer/dist/store";
import { uuidv4 } from "@set/utils//dist/uuid";
import { useSession } from "auth/provider";
import { getConnection } from "connection";
import { useAtom } from "jotai";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Provider as ReduxStoreProvider } from "react-redux";
import type { Middleware } from "redux";
import { connectionStateAtom, timeOffsetAtom, timingPointIdAtom } from "states/stopwatch-states";
import { BottomMenu } from "../../../../../components/stopwatch/bottom-menu";
import { Status } from "../../../../../components/stopwatch/status";
import "../../../../../globals.scss";
import { ServerConnectionHandler } from "../../../../../server-connection-handler";
import { trpc } from "../../../../../trpc-core";
import Link from "next/link";
import { type Route } from "next";
import type { IssuedAction } from "@set/timer/dist/slices/actions-history";
import { useTranslations } from "next-intl";

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

    const issuedAction = action as IssuedAction;

    if (!issuedAction.meta?.remote && socket?.OPEN)
        void externals.trpc?.action.dispatch.mutate({ raceId: externals.raceId!, clientId, action });

    next(action);
};

const addIssuerMiddleware: Middleware<object, TimerState, TimerDispatch> = _ => next => action => {
    const issuedAction = action as IssuedAction;

    if (!issuedAction.meta?.remote) {
        issuedAction.__issuer = externals.user!;
        issuedAction.__issuedAt = Date.now() + (externals.timeOffset || 0);
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

const ErrorPage = ({
    icon,
    title,
    anchorText,
    anchorHref,
    description,
}: {
    icon: string;
    title: string;
    anchorText: string;
    anchorHref: Route;
    description: string;
}) => (
    <div className="flex h-full w-full items-center justify-center px-4">
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
                <Icon path={icon} size={1}></Icon>
                <div className="mt-2 text-center text-xl font-bold">{title}</div>
            </div>
            <div className="my-4 text-center text-sm font-medium text-gray-500">{description}</div>
            <Link href={anchorHref} className="mt-8 rounded-2xl bg-gray-100 px-4 py-1 text-center text-sm font-medium">
                {anchorText}
            </Link>
        </div>
    </div>
);

export function StopwatchLayout({ children, title }: { children: ReactNode; title: ReactNode }) {
    const [connectionState] = useAtom(connectionStateAtom);
    const [timingPointId] = useAtom(timingPointIdAtom);
    const { raceId } = useParams<{ raceId: string }>()!;
    const pathname = usePathname()!;

    const { data: timingPointOrder } = trpc.timingPoint.timingPointsOrder.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });

    const isOffline = connectionState !== "connected";
    const timingPointMissing = !timingPointId || !timingPointOrder.includes(timingPointId);

    const t = useTranslations();

    return (
        <ReduxStoreProvider store={store}>
            <ExternalsExposer />
            <ServerConnectionHandler dispatch={store.dispatch} raceId={parseInt(raceId)} clientId={clientId}>
                <div id="app-holder" className="flex h-full w-screen flex-col overflow-hidden text-zinc-700">
                    <Status raceId={raceId} />
                    {title}
                    <div id="module-holder" className="relative h-full flex-1 flex-col overflow-y-auto">
                        {isOffline ? (
                            <ErrorPage
                                icon={mdiCloudOffOutline}
                                title={t("stopwatch.error.disconnected.title")}
                                anchorText={t("stopwatch.error.disconnected.anchorText")}
                                description={t("stopwatch.error.disconnected.description")}
                                anchorHref={`/stopwatch/${raceId}` as Route}
                            />
                        ) : timingPointMissing && !pathname.includes("settings") ? (
                            <ErrorPage
                                icon={mdiCogOutline}
                                title={t("stopwatch.error.noTimingPoint.title")}
                                anchorText={t("stopwatch.error.noTimingPoint.anchorText")}
                                description={t("stopwatch.error.noTimingPoint.description")}
                                anchorHref={`/stopwatch/${raceId}/settings` as Route}
                            />
                        ) : (
                            children
                        )}
                    </div>
                    <BottomMenu pathname={pathname} raceId={raceId} isOffline={isOffline} timingPointMissing={timingPointMissing} />
                </div>
            </ServerConnectionHandler>
        </ReduxStoreProvider>
    );
}
