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
    const splits = splitTime(new Date(time));

    return (
        <div className={classNames("scale-150 text-6xl flex items-end", { ["animate-pulse"]: stopped })}>
            <div className="flex flex-col items-center">
                <div className="text-base text-zinc-600">HRS</div>
                <div className="font-mono text-center font-normal w-20">{splits.hours}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-base text-zinc-600">MINS</div>
                <div className="font-mono text-center font-normal w-20">{splits.minutes}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-base text-zinc-600">SECS</div>
                <div className="font-mono text-center font-normal w-20">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="font-mono text-center text-orange-500 text-5xl font-bold">{splits.miliseconds}</div>
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
            <div className="select-none bg-black h-full w-full text-white relative overflow-hidden">
                {globalTime === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">Smarujemy łańcuch...</div>
                ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <Time stopped={false} time={globalTime!} />
                    </div>
                )}
            </div>
        </>
    );
};
