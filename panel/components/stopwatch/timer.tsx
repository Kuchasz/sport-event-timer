"use client"

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { connectionStateAtom, timingPointIdAtom } from "states/stopwatch-states";
import { Time } from "./time";

export const Timer = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);
    const [connectionState] = useAtom(connectionStateAtom);
    const [timingPointId] = useAtom(timingPointIdAtom);
    // const pathname = usePathname();

    const shouldBeStopped = connectionState !== "connected" || !timingPointId || typeof window === 'undefined';

    useEffect(() => {
        if (!shouldBeStopped) {
            const interval = setInterval(() => setTime(Date.now() + offset), 100);
            return () => clearInterval(interval);
        }

        return () => {};
    }, [offset, connectionState]);

    return <Time time={time} stopped={shouldBeStopped} />;
};
