import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import type { TimerState, TimerDispatch } from "@set/timer/dist/store";
import { useRouter } from "next/router";

export const useFormState = <T,>(initialFormState: T, depts: unknown[]) => {
    const [state, setState] = useState({ ...initialFormState });

    const fieldChangeHandler =
        <K extends keyof T>(prop: K) =>
        (e: { target: { value: T[K] } }) =>
            setState((prev) => ({ ...prev, [prop]: e?.target?.value }));

    const reset = () => setState({ ...initialFormState });
    useEffect(reset, depts);

    return [state, fieldChangeHandler, reset] as const;
};

export const useTimerDispatch = () => useDispatch<TimerDispatch>();
export const useTimerSelector: TypedUseSelectorHook<TimerState> = useSelector;

export const useCurrentRaceId = () => {
    const { raceId } = useRouter().query;

    return raceId ? parseInt(raceId as string) : undefined;
}

export const usePreviousValue = <T,>(value: T) => {
    const ref = useRef<T>();

    useEffect(() => {
        if (value === undefined || value === null) return;
        ref.current = value;
    }, [value]);

    return ref.current;
};
