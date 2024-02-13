"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { connectionStateAtom, timingPointIdAtom } from "src/states/stopwatch-states";
import { Time } from "./time";

export const Timer = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(0);
    const [connectionState] = useAtom(connectionStateAtom);
    const [timingPointId] = useAtom(timingPointIdAtom);

    const shouldBeStopped = connectionState !== "connected" || !timingPointId || typeof window === "undefined";

    useEffect(() => {
        let tickInterval: number;

        const tickTime = () => {
            const globalTime = Date.now() + offset;

            !shouldBeStopped && setTime(globalTime);

            tickInterval = requestAnimationFrame(tickTime);
        };

        tickTime();

        return () => {
            cancelAnimationFrame(tickInterval);
        };
    }, [offset, connectionState]);

    return <Time time={time} stopped={shouldBeStopped} />;
};
