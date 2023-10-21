"use client";

import { splitTime, zeroSplits } from "@set/utils/dist/datetime";
import classNames from "classnames";

export const Time = ({ time, stopped }: { time: number; stopped: boolean }) => {
    const splits = time === 0 ? zeroSplits : splitTime(new Date(time));

    return (
        <div className={classNames("flex items-end text-3xl", { ["animate-pulse"]: stopped })}>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">HRS</div>
                <div className="w-10 text-center font-mono font-normal">{splits.hours}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">MINS</div>
                <div className="w-10 text-center font-mono font-normal">{splits.minutes}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">SECS</div>
                <div className="w-10 text-center font-mono font-normal">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="text-center font-mono text-xl font-bold text-orange-500">{splits.miliseconds}</div>
        </div>
    );
};
