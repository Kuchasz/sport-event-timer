"use client";

import { mdiAutorenew, mdiCloudOffOutline, mdiCogOutline, mdiWeatherCloudyAlert } from "@mdi/js";
import { Icon } from "@mdi/react";
import classNames from "classnames";
import type { ConnectionState } from "connection";
import { useAtom } from "jotai";
import Link from "next/link";
import { connectionStateAtom, timeOffsetAtom, timingPointIdAtom } from "states/stopwatch-states";
import { trpc } from "../../trpc-core";
import { Timer } from "./timer";
import { useTranslations } from "next-intl";

const SelectedTimingPoint = ({ timingPointName }: { timingPointName: string }) => {
    const t = useTranslations();
    return (
        <span className="flex cursor-pointer flex-col items-start rounded-xl pl-4 pr-2 text-zinc-300 transition-colors hover:bg-zinc-700">
            <span className="text-2xs text-zinc-600">{t("stopwatch.status.timingPoint")}</span>
            <span className="">{timingPointName}</span>
        </span>
    );
};

const SettingsCog = () => (
    <span className="flex cursor-pointer items-center rounded-xl bg-zinc-800 px-2 py-1 text-zinc-300 transition-colors hover:bg-zinc-700">
        <Icon size={1} path={mdiCogOutline} />
    </span>
);

const StatusBar = ({
    displayOn: desiredState,
    color,
    icon,
    text,
    connectionState,
    pulse = false,
    spin = false,
}: {
    displayOn: ConnectionState;
    color: React.ComponentProps<"div">["className"];
    icon: string;
    text: string;
    connectionState: ConnectionState;
    pulse?: boolean;
    spin?: boolean;
}) => (
    <span
        className={classNames(
            `absolute z-10 flex w-full items-center justify-center overflow-hidden text-xs font-semibold text-white transition-all ease-out ${color}`,
            {
                ["h-0"]: connectionState !== desiredState,
                ["h-auto py-2"]: connectionState === desiredState,
                ["animate-pulse"]: pulse,
            },
        )}>
        <span
            className={classNames("flex items-center transition-opacity", {
                ["opacity-0"]: connectionState !== desiredState,
                ["opacity-100"]: connectionState === desiredState,
            })}>
            <div className="mr-2">{text}</div>
            <Icon
                className={classNames({
                    ["animate-spin"]: spin,
                })}
                path={icon}
                size={0.8}
            />
        </span>
    </span>
);

export const Status = ({ raceId }: { raceId: string }) => {
    const [connectionState] = useAtom(connectionStateAtom);

    const { data: allTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: parseInt(raceId) },
        {
            initialData: [],
        },
    );
    const { data: timingPointOrder } = trpc.timingPoint.timingPointsOrder.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);
    const timingPoint = allTimingPoints.find(tk => tk.id === timingPointId);

    const timingPointMissing = !timingPoint || !timingPointOrder.includes(timingPointId);

    return (
        <div>
            <StatusBar
                color="bg-orange-600"
                icon={mdiAutorenew}
                displayOn="connecting"
                text="CONNECTING"
                connectionState={connectionState}
                spin
            />
            <StatusBar
                color="bg-red-600"
                icon={mdiWeatherCloudyAlert}
                displayOn="error"
                text="CONNECTION ERROR"
                connectionState={connectionState}
            />
            <StatusBar
                color="bg-zinc-600"
                icon={mdiCloudOffOutline}
                displayOn="disconnected"
                text="OFF-LINE"
                connectionState={connectionState}
            />
            <div className="z-10 flex w-screen flex-shrink-0 items-center justify-between bg-black px-4 py-2 font-semibold text-white">
                <Timer offset={offset} />

                <span className="flex w-full">
                    {!timingPointMissing && <SelectedTimingPoint timingPointName={timingPoint.name} />}
                    <div className="flex-grow"></div>
                    <Link href={`/stopwatch/${raceId}/settings`}>
                        <SettingsCog />
                    </Link>
                </span>
            </div>
        </div>
    );
};
