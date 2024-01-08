"use client";

import { splitTime, zeroSplits } from "@set/utils/dist/datetime";
import classNames from "classnames";

export const Time = ({ time, stopped }: { time: number; stopped: boolean }) => {
    const splits = time === 0 ? zeroSplits : splitTime(new Date(time));

    return (
        <div className={classNames("flex items-end text-2xl leading-none", { ["animate-pulse"]: stopped })}>
            <div className="flex flex-col items-center">
                <div className="text-2xs pb-0.5 text-zinc-600">HRS</div>
                <div className="w-8 text-center font-mono font-normal">{splits.hours}</div>
            </div>
            <div className="px-0.5 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-2xs pb-0.5 text-zinc-600">MINS</div>
                <div className="w-8 text-center font-mono font-normal">{splits.minutes}</div>
            </div>
            <div className="px-0.5 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-2xs pb-0.5 text-zinc-600">SECS</div>
                <div className="w-8 text-center font-mono font-normal">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="text-center font-mono text-lg font-bold leading-none text-orange-500">{splits.miliseconds}</div>
        </div>
    );
};
