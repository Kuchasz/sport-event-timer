import { atomWithStorage } from "jotai/utils";

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type TimerSettings = {
    showSettings: boolean;
    clock: TextSettings;
    countdown: TextSettings;
    players: TextSettings & { count: number };
};

const defaultTimerSettings: TimerSettings = {
    showSettings: false,
    clock: { enabled: true, size: 6 },
    countdown: { enabled: true, size: 40 },
    players: { enabled: true, size: 14, count: 3 },
};

export const timerSettingsAtom = atomWithStorage<TimerSettings>("set.timerSettings", defaultTimerSettings);