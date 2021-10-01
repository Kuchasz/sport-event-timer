import * as Arr from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as Option from "fp-ts/Option";
import * as Ord from "fp-ts/Ord";
import { flow, increment, pipe } from "fp-ts/function";

export type Gender = "male" | "female";

export type Player = {
    id: number;
    name: string;
    lastName: string;
    number: number;
    birthYear: number;
    gender: Gender;
    city: string;
    raceCategory: string;
    team: string;
    country: string;
};

export type RaceCategory = {
    id: number;
    name: string;
    minAge?: number;
    maxAge?: number;
    gender?: Gender;
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

export const getNextId = flow(
    Arr.sortBy([
        pipe(
            N.Ord,
            Ord.contramap((e: { id: number }) => e.id)
        )
    ]),
    Arr.last,
    Option.map((e) => e.id),
    Option.fold(() => 0, increment)
);

export const removeById = <T extends { id: number }>(items: T[], id: number) =>
    pipe(
        items,
        Arr.filter((e) => e.id !== id)
    );

export const register = (players: Player[], newPlayer: Omit<Player, "id">): Player[] =>
    pipe(players, Arr.append({ ...newPlayer, id: getNextId(players) }));

export const changeInfo = (players: Player[], modifiedPlayer: Player): Player[] =>
    pipe(
        players,
        Arr.updateAt(
            pipe(
                players,
                Arr.findIndex((e) => e.id === modifiedPlayer.id),
                Option.fold(
                    () => -1,
                    (e) => e
                )
            ),
            modifiedPlayer
        ),
        Option.fold(
            () => players,
            (e) => e
        )
    );

export const upload = (_players: Player[], newPlayers: Player[]): Player[] => newPlayers;

export const addTimeKeeper = (timeKeepers: TimeKeeper[], newTimeKeeper: Omit<TimeKeeper, "id">): TimeKeeper[] =>
    pipe(timeKeepers, Arr.append({ ...newTimeKeeper, id: getNextId(timeKeepers) }));

export const removeTimeKeeper = (timeKeepers: TimeKeeper[], id: number): TimeKeeper[] => removeById(timeKeepers, id);

export const addTimeStamp = (timeStamps: TimeStamp[], timeStamp: Omit<TimeStamp, "id">): TimeStamp[] =>
    pipe(timeStamps, Arr.append({ ...timeStamp, id: getNextId(timeStamps) }));

export const resetTimeStamp = (timeStamps: TimeStamp[], id: number): TimeStamp[] => removeById(timeStamps, id);

export const updateTimeStamp = (timeStamps: TimeStamp[], modifiedTimeStamp: Pick<TimeStamp, "id">): TimeStamp[] =>
    pipe(
        timeStamps,
        Arr.modifyAt(
            pipe(
                timeStamps,
                Arr.findIndex((e) => e.id === modifiedTimeStamp.id),
                Option.fold(
                    () => -1,
                    (e) => e
                )
            ),
            (e) => ({ ...e, ...modifiedTimeStamp })
        ),
        Option.fold(
            () => timeStamps,
            (e) => e
        )
    );

export const addRaceCategory = (
    raceCategories: RaceCategory[],
    raceCategory: Omit<RaceCategory, "id">
): RaceCategory[] => pipe(raceCategories, Arr.append({ ...raceCategory, id: getNextId(raceCategories) }));

export const removeRaceCategory = (raceCategories: RaceCategory[], id: number): RaceCategory[] =>
    removeById(raceCategories, id);
