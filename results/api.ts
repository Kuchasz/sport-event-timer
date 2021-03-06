import { ClockListPlayer, PlayerResult } from "@set/shared/dist";
import { Player } from "@set/timer/model";
import { TimerState } from "@set/timer/store";

const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";
export const getState = (): Promise<TimerState> => fetch(`${hubUrl}/state`).then(x => x.json());
export const getProRaceResults = (): Promise<PlayerResult[]> => fetch(`${hubUrl}/pro-results`).then(x => x.json());
export const getFunRaceResults = (): Promise<PlayerResult[]> => fetch(`${hubUrl}/fun-results`).then(x => x.json());
export const getTimeTrialRaceResults = (): Promise<PlayerResult[]> =>
    fetch(`${hubUrl}/timetrial-results`).then(x => x.json());
export const getGCResults = (): Promise<PlayerResult[]> => fetch(`${hubUrl}/gc-results`).then(x => x.json());
export const getPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/players`).then(x => x.json());
export const getFunRacePlayers = (): Promise<Player[]> => fetch(`${hubUrl}/fun-players`).then(x => x.json());
export const getProRacePlayers = (): Promise<Player[]> => fetch(`${hubUrl}/pro-players`).then(x => x.json());
export const getTimeTrialPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/timetrial-players`).then(x => x.json());
export const getGCPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/gc-players`).then(x => x.json());
export const getPlayersDate = (): Promise<number> => fetch(`${hubUrl}/players-date`).then(x => x.json());
export const getTimerPlayers = (): Promise<ClockListPlayer[]> => fetch(`${hubUrl}/clock-players`).then(x => x.json());
export const timeSyncUrl = `${hubUrl}/timesync`;
