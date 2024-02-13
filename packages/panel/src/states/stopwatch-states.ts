import type { ConnectionState } from "src/connection";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type StopWatchMode = "list" | "pad" | "times";

export const timingPointIdAtom = atomWithStorage<number>("set.stopwatch.timing-point-id", 0);
export const connectionStateAtom = atom<ConnectionState>("connecting");
export const timeOffsetAtom = atom<number>(0);
