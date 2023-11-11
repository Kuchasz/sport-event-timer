"use client";

import React from "react";
import { useEffect, useState } from "react";
import { trpc } from "trpc-core";
import { splitTime } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { allowedLatency } from "connection";
import { useSystemTime } from "hooks";

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type TextActions = {
    enlargeFont: () => void;
    minifyFont: () => void;
    toggle: () => void;
};

const Time = ({ time, stopped }: { time: number; stopped: boolean }) => {
    const splits = splitTime(new Date(time), true);

    return (
        <div className={classNames("flex scale-150 items-end text-6xl", { ["animate-pulse"]: stopped })}>
            <div className="flex flex-col items-center">
                <div className="text-base text-zinc-600">HRS</div>
                <div className="w-20 text-center font-mono font-normal">{splits.hours}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-base text-zinc-600">MINS</div>
                <div className="w-20 text-center font-mono font-normal">{splits.minutes}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-base text-zinc-600">SECS</div>
                <div className="w-20 text-center font-mono font-normal">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="text-center font-mono text-5xl font-bold text-orange-500">{splits.miliseconds}</div>
        </div>
    );
};

export const TabletTimer = () => {
    const [globalTime, setGlobalTime] = useState<number>();
    const ntpMutation = trpc.ntp.sync.useMutation();

    const systemTime = useSystemTime(allowedLatency, ntpMutation.mutateAsync);

    useEffect(() => {
        if (systemTime === undefined) return;

        let tickInterval: number;

        const tickTime = () => {
            const globalTime = Date.now() + systemTime.timeOffset;

            setGlobalTime(globalTime);

            tickInterval = requestAnimationFrame(tickTime);
        };

        tickTime();

        return () => {
            cancelAnimationFrame(tickInterval);
        };
    }, [systemTime]);

    return (
        <>
            <div className="relative h-full w-full select-none overflow-hidden bg-black text-white">
                {globalTime === undefined ? (
                    <div className="min-w-screen flex min-h-screen items-center justify-center font-semibold">Smarujemy łańcuch...</div>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <Time stopped={false} time={globalTime} />
                    </div>
                )}
            </div>
        </>
    );
};
