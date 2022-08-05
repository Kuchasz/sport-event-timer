import { CurrentRaceContext } from "current-race-context";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import type { TimerState, TimerDispatch } from "@set/timer/dist/store";

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
export const useCurrentRaceId = () => useContext(CurrentRaceContext).raceId;
