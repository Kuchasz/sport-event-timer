import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { TimerState, TimerDispatch } from "@set/timer/dist/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useTimerDispatch = () => useDispatch<TimerDispatch>();
export const useTimerSelector: TypedUseSelectorHook<TimerState> = useSelector;
