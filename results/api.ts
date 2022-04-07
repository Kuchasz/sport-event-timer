import { ClockListPlayer, PlayerResult } from "@set/shared/dist";
import { Player } from "@set/timer/model";
import { TimerState } from "@set/timer/store";

const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";
export const getState = (): Promise<TimerState> => fetch(`${hubUrl}/state`).then(x => x.json());
export const getRaceTimes = (): Promise<PlayerResult[]> => fetch(`${hubUrl}/race-results`).then(x => x.json());
export const getTimeTrialTimes = (): Promise<PlayerResult[]> =>
    fetch(`${hubUrl}/timetrial-results`).then(x => x.json());
export const getPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/players`).then(x => x.json());
export const getFunRacePlayers = (): Promise<Player[]> => fetch(`${hubUrl}/fun-players`).then(x => x.json());
export const getProRacePlayers = (): Promise<Player[]> => fetch(`${hubUrl}/pro-players`).then(x => x.json());
export const getTimeTrialPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/timetrial-players`).then(x => x.json());
export const getPlayersDate = (): Promise<number> => fetch(`${hubUrl}/players-date`).then(x => x.json());
export const getTimerPlayers = (): Promise<ClockListPlayer[]> => fetch(`${hubUrl}/clock-players`).then(x => x.json());
export const timeSyncUrl = `${hubUrl}/timesync`;
