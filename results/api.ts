import { Player } from "@set/timer/model";
import { TimerState } from "@set/timer/store";

const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";
export const getState = (): Promise<TimerState> => fetch(`${hubUrl}/state`).then((x) => x.json());
export const getPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/players`).then((x) => x.json());
export const getPlayersDate = (): Promise<number> => fetch(`${hubUrl}/players-date`).then((x) => x.json());
export const getCurrentTimeOffset = (): Promise<number> => {
    return new Promise<number>(async (res) => {
        const clientSendTime = Date.now();
        const { diff, serverTime } = await fetch(`${hubUrl}/current-time/${clientSendTime}`).then((x) => x.json());
        const clientResponseTime = Date.now();
        const serverClientResponseDiffTime = clientResponseTime - serverTime;
        res((diff - clientResponseTime + clientSendTime - serverClientResponseDiffTime) / 2);
    });
};
