import { ConnectionState } from "connection";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export type StopWatchMode = "list" | "pad" | "times";

export const userAtom = atomWithStorage<string>("set.user", "");
export const timingPointIdAtom = atomWithStorage<number>("set.timingPointId", 0);
export const tokenExpireAtom = atomWithStorage<number>("set.tokenExpire", 0);
export const connectionStateAtom = atom<ConnectionState>('connecting');
export const timeOffsetAtom = atom<number>(0);