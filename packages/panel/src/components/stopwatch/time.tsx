"use client";

import { splitTime, zeroSplits } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { useTranslations } from "next-intl";

export const Time = ({ time, stopped }: { time: number; stopped: boolean }) => {
    const splits = time === 0 ? zeroSplits : splitTime(new Date(time));

    const t = useTranslations();

    return (
        <div>
            <div className="text-2xs text-zinc-600">{t("stopwatch.status.systemTime")}</div>
            <div className={classNames("-ml-0.5 flex items-end text-2xl leading-none text-zinc-300", { ["animate-pulse"]: stopped })}>
                <div className="flex flex-col items-center">
                    <div className="w-8 text-center font-mono font-normal">{splits.hours}</div>
                </div>
                <div className="px-0.5 text-zinc-600">:</div>
                <div className="flex flex-col items-center">
                    <div className="w-8 text-center font-mono font-normal">{splits.minutes}</div>
                </div>
                <div className="px-0.5 text-zinc-600">:</div>
                <div className="flex flex-col items-center">
                    <div className="w-8 text-center font-mono font-normal">{splits.seconds}</div>
                </div>
                <div className="-ml-0.5 text-zinc-500">.</div>
                <div className="text-center font-mono text-lg font-bold leading-none text-orange-500">{splits.miliseconds}</div>
            </div>
        </div>
    );
};
