"use client";

import { splitTime, zeroSplits } from "@set/utils/dist/datetime";
import classNames from "classnames";

export const Time = ({ time, stopped }: { time: number; stopped: boolean }) => {
    const splits = time === 0 ? zeroSplits : splitTime(new Date(time));

    return (
        <div className={classNames("text-3xl flex items-end", { ["animate-pulse"]: stopped })}>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">HRS</div>
                <div className="font-mono text-center font-normal w-10">{splits.hours}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">MINS</div>
                <div className="font-mono text-center font-normal w-10">{splits.minutes}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">SECS</div>
                <div className="font-mono text-center font-normal w-10">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="font-mono text-center text-orange-500 text-xl font-bold">{splits.miliseconds}</div>
        </div>
    );
};
