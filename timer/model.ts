import * as R from "ramda";
import timeStamps from "./slices/time-stamps";

export type Gender = "male" | "female";

export type Player = {
    id: number;
    name: string;
    lastName: string;
    number: number;
    birthYear: number;
    gender: Gender;
};

export type TimeKeeperType = "start" | "checkpoint" | "end";

export type TimeKeeper = {
    id: number;
    name: string;
    type: TimeKeeperType;
};

export type TimeStamp = {
    id: number;
    playerId?: number;
    timeKeeperId: number;
    time: number;
};

export type State = {
    players: Player[];
    timeKeepers: TimeKeeper[];
    timeStamps: TimeStamp[];
};

export type RaceResult = {
    player: Omit<Player, "id">;
    timeStamps: { [timeKeeperId: number]: number };
};

export type RaceResults = RaceResult[];

export const getNextId = <T extends { id: number }>(items: T[]) => {
    const getLastItem = R.last as (arr: T[]) => T;
    const sortDescById = R.sortBy(R.prop("id")) as (arr: T[]) => T[];

    const newId = R.compose(R.inc, R.propOr(-1, "id"), getLastItem, sortDescById);
    return newId(items);
};

export const removeById = <T extends { id: number }>(items: T[], id: number) =>
    R.remove(R.findIndex(R.propEq("id", id))(items), 1, items);

export const register = (players: Player[], newPlayer: Omit<Player, "id">): Player[] =>
    R.append({ ...newPlayer, id: getNextId(players) }, players);

export const changeInfo = (players: Player[], modifiedPlayer: Player): Player[] => {
    const player = players.find((x) => x.id === modifiedPlayer.id);

    return player ? R.update(R.indexOf(player)(players), { ...modifiedPlayer }, players) : players;
};

export const addTimeKeeper = (timeKeepers: TimeKeeper[], newTimeKeeper: Omit<TimeKeeper, "id">): TimeKeeper[] =>
    R.append({ ...newTimeKeeper, id: getNextId(timeKeepers) }, timeKeepers);

export const removeTimeKeeper = (timeKeepers: TimeKeeper[], id: number): TimeKeeper[] => removeById(timeKeepers, id);

export const addTimeStamp = (timeStamps: TimeStamp[], timeStamp: Omit<TimeStamp, "id">): TimeStamp[] =>
    R.append({ ...timeStamp, id: getNextId(timeStamps) }, timeStamps);

export const resetTimeStamp = (timeStamps: TimeStamp[], id: number): TimeStamp[] => removeById(timeStamps, id);

export const assignPlayer = (
    timeStamps: TimeStamp[],
    modifiedTimeStamp: Pick<TimeStamp, "id" | "playerId">
): TimeStamp[] => {
    const timeStamp = timeStamps.find((x) => x.id === modifiedTimeStamp.id);

    return timeStamp
        ? R.update(R.indexOf(timeStamp)(timeStamps), { ...timeStamp, ...modifiedTimeStamp }, timeStamps)
        : timeStamps;
};
