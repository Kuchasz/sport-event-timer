"use client";

import React from "react";
import { sort } from "@set/utils/dist/array";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "trpc-core";
import { splitTime } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { allowedLatency } from "connection";

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type TextActions = {
    enlargeFont: () => void;
    minifyFont: () => void;
    toggle: () => void;
};

const clockTimeout = 100;

const Time = ({ time, stopped }: { time: number; stopped: boolean }) => {
    const splits = splitTime(new Date(time));

    return (
        <div className={classNames("scale-150 translate-x-[50%] text-6xl flex items-end", { ["animate-pulse"]: stopped })}>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">HRS</div>
                <div className="font-mono text-center font-normal w-20">{splits.hours}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">MINS</div>
                <div className="font-mono text-center font-normal w-20">{splits.minutes}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">SECS</div>
                <div className="font-mono text-center font-normal w-20">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="font-mono text-center text-orange-500 text-5xl font-bold">{splits.miliseconds}</div>
        </div>
    );
};

export const TabletTimer = () => {
    const [systemTime, setSystemTime] = useState<{ timeOffset: number; latency: number }>();
    const [globalTime, setGlobalTime] = useState<number>();

    const { raceId } = useParams() as { raceId: string };

    const { data: players } = trpc.player.startList.useQuery(
        { raceId: Number.parseInt(raceId! as string) },
        { enabled: !!raceId, select: data => sort(data, d => d.absoluteStartTime) }
    );
    const ntpMutation = trpc.ntp.sync.useMutation();

    useEffect(() => {
        if (systemTime === undefined || players === undefined) return;

        const tickSecondsToPlayer = () => {
            const globalTime = Date.now() + systemTime.timeOffset;
            // const globalDateTime = new Date(globalTime);
            // const miliseconds = globalDateTime.getMilliseconds();

            // if (miliseconds <= clockTimeout) {
            setGlobalTime(globalTime);
            // }
        };

        tickSecondsToPlayer();
        const secondsToPlayerInterval = setInterval(tickSecondsToPlayer, clockTimeout);

        return () => {
            clearInterval(secondsToPlayerInterval);
        };
    }, [systemTime, players]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const requestTimeSync = async () => {
            const loadStartTime = Date.now();
            const serverTime: number = await ntpMutation.mutateAsync(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - Math.floor(serverTime + latency / 2));

            if (systemTime === undefined || latency < systemTime.latency)
                setSystemTime({
                    timeOffset,
                    latency,
                });

            if (latency > allowedLatency) timeout = setTimeout(requestTimeSync, 1000);
        };

        requestTimeSync();

        return () => {
            clearTimeout(timeout);
        };
    }, [systemTime]);

    return (
        <>
            <div className="select-none bg-black h-full w-full text-white relative overflow-hidden">
                {globalTime === undefined || players === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">Smarujemy łańcuch...</div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        <div className="flex flex-col w-full flex-grow overflow-y-hidden">
                            <Time stopped={false} time={globalTime!} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};