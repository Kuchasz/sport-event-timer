"use client";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import type { TimerState, TimerDispatch } from "@set/timer/dist/store";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { selectedRaceIdAtom } from "states/panel-states";

export const useFormState = <T,>(initialFormState: T, depts: unknown[]) => {
    const [state, setState] = useState({ ...initialFormState });

    const fieldChangeHandler =
        <K extends keyof T>(prop: K) =>
        (e: { target: { value: T[K] } }) =>
            setState(prev => ({ ...prev, [prop]: e?.target?.value }));

    const reset = () => setState({ ...initialFormState });
    useEffect(reset, depts);

    return [state, fieldChangeHandler, reset] as const;
};

export const useTimerDispatch = () => useDispatch<TimerDispatch>();
export const useTimerSelector: TypedUseSelectorHook<TimerState> = useSelector;

export const useCurrentRaceId = () => {
    const [selectedRaceId] = useAtom(selectedRaceIdAtom);
    const { raceId } = useParams() as { raceId: string };

    return raceId ? parseInt(raceId as string) : selectedRaceId;
};

export const usePreviousValue = <T,>(value: T) => {
    const ref = useRef<T>();

    useEffect(() => {
        if (value === undefined || value === null) return;
        ref.current = value;
    }, [value]);

    return ref.current;
};

export const useSystemTime = (allowedLatency: number, getServerTime: (loadStartTime: number) => Promise<number>) => {
    const [systemTime, setSystemTime] = useState<{ timeOffset: number; latency: number }>();

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let syncTries = 0;

        const requestTimeSync = async () => {
            syncTries++;
            const loadStartTime = Date.now();
            const serverTime: number = await getServerTime(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - Math.floor(serverTime + latency / 2));

            if (systemTime === undefined || latency < systemTime.latency)
                setSystemTime({
                    timeOffset,
                    latency,
                });

            if (latency > allowedLatency || syncTries < 5) timeout = setTimeout(requestTimeSync, 250);
        };

        requestTimeSync();

        return () => {
            clearTimeout(timeout);
        };
    }, [systemTime]);

    return systemTime;
};

export const useDeferredValue = <T,>(value: T, delayMs = 250) => {
    const [deferredValue, setDeferredValue] = useState<T>(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDeferredValue(value);
        }, delayMs);

        return () => {
            clearTimeout(timerId);
        };
    }, [value, delayMs]);

    return deferredValue;
};
