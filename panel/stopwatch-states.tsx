import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export type StopWatchMode = "list" | "pad" | "times";

export const userAtom = atomWithStorage<string>("set.user", "");
export const timeKeeperIdAtom = atomWithStorage<number>("set.timeKeeperId", 0);
export const tokenExpireAtom = atomWithStorage<number>("set.tokenExpire", 0);
export const connectionStateAtom = atom<string>("");
export const timeOffsetAtom = atom<number>(0);