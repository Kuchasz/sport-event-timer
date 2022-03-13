import { Player } from "@set/timer/model";
import { TimerState } from "@set/timer/store";

const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";
export const getState = (): Promise<TimerState> => fetch(`${hubUrl}/state`).then((x) => x.json());
export const getPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/players`).then((x) => x.json());
export const getPlayersDate = (): Promise<number> => fetch(`${hubUrl}/players-date`).then((x) => x.json());
export const getCurrentTimeOffset = (): Promise<number> => {
    return new Promise<number>(async (res) => {
        const t0 = Date.now();
        const { t1 } = await fetch(`${hubUrl}/current-time/${t0}`).then((x) => x.json());

        const t2 = Date.now();

        res(t2 - t1 + (t2 - t0) / 2);
    });
};
