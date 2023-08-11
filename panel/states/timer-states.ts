import { atomWithStorage } from "jotai/utils";

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type TimerSettings = {
    showSettings: boolean;
    clock: TextSettings;
    countdown: TextSettings;
    nextPlayers: TextSettings & { count: number, showTime: boolean };
    players: TextSettings;
    currentPlayer: TextSettings;
};

const defaultTimerSettings: TimerSettings = {
    showSettings: false,
    clock: { enabled: true, size: 4 },
    countdown: { enabled: true, size: 40 },
    nextPlayers: { enabled: true, size: 24, count: 3, showTime: false },
    players: { enabled: false, size: 14 },
    currentPlayer: { enabled: true, size: 64 }
};

export const timerSettingsAtom = atomWithStorage<TimerSettings>("set.timer.settings", defaultTimerSettings);