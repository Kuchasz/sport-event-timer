import * as Arr from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as Option from "fp-ts/Option";
import * as Ord from "fp-ts/Ord";
import { flow, increment, pipe } from "fp-ts/function";

export type Gender = "male" | "female";

export type Classification = {
    name: string;
    id: string;
};

export type RegistrationPlayer = {
    id: number;
    // number?: number; // !!!!!!!!
    // chipNumber: number; // !!!!!!!
    classificationId: string;
    // category: string; // !!!!!!!
    name: string;
    lastName: string;
    gender: Gender;
    // age: number; // !!!!!!!!
    birthDate: Date;
    country: string;
    city: string;
    team: string;
    email: string;
    phoneNumber: string;
    icePhoneNumber: string;
    //["Anonimowy"]: string;
    // ["Kwota przelewu"]: string;
    // ["Kwota za start"]: string;
    // ["Kwota za sklep"]: string;
    // ["Kwota za ubezpieczenie"]: string;
    // ["Data przelewu"]: string;
    // ["Numer transakcji"]: string;
    // ["Status opłaty"]: string;
    // ["Data rejestracji"]: string;
    // ["Nr GPS"]: string;
    //["Status zawodnika"]: string;
    // ["Notatka"]: string;
    // ["Pliki"]: string;
};

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
    startTime?: number;
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

export type TimeKeeperConfig = {
    timeOffset?: number;
    connectionState: ConnectionState;
};

export type ConnectionState = "connected" | "connecting" | "disconnected" | "error";

export type UserConfig = {
    user?: string;
    timeKeeperId?: number;
    tokenExpire?: number;
};

export type HistoricAction = {
    issuer: string;
    issuedAt: number;
    action: { type: string; payload: any };
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
    Option.map(e => e.id),
    Option.fold(() => 0, increment)
);

export const removeById = <T extends { id: number }>(items: T[], id: number) =>
    pipe(
        items,
        Arr.filter(e => e.id !== id)
    );

export const registerPlayer = (players: Player[], newPlayer: Omit<Player, "id">): Player[] =>
    pipe(players, Arr.append({ ...newPlayer, id: getNextId(players) }));

export const changePlayerInfo = (players: Player[], modifiedPlayer: Player): Player[] =>
    pipe(
        players,
        Arr.updateAt(
            pipe(
                players,
                Arr.findIndex(e => e.id === modifiedPlayer.id),
                Option.fold(
                    () => -1,
                    e => e
                )
            ),
            modifiedPlayer
        ),
        Option.fold(
            () => players,
            e => e
        )
    );

export const uploadPlayers = (_players: Player[], newPlayers: Player[]): Player[] => newPlayers;

export const addTimeKeeper = (timeKeepers: TimeKeeper[], newTimeKeeper: TimeKeeper): TimeKeeper[] =>
    pipe(timeKeepers, Arr.append({ ...newTimeKeeper }));

// export const addTimeKeeper = (timeKeepers: TimeKeeper[], newTimeKeeper: Omit<TimeKeeper, "id">): TimeKeeper[] =>
//     pipe(timeKeepers, Arr.append({ ...newTimeKeeper, id: getNextId(timeKeepers) }));

export const removeTimeKeeper = (timeKeepers: TimeKeeper[], id: number): TimeKeeper[] => removeById(timeKeepers, id);

export const addTimeStamp = (timeStamps: TimeStamp[], timeStamp: Omit<TimeStamp, "id">): TimeStamp[] =>
    pipe(timeStamps, Arr.append({ ...timeStamp, id: getNextId(timeStamps) }));

export const addHistoricAction = (historicActions: HistoricAction[], action: HistoricAction): HistoricAction[] =>
    pipe(historicActions, Arr.append({ ...action }));

export const resetTimeStamp = (timeStamps: TimeStamp[], id: number): TimeStamp[] => removeById(timeStamps, id);

export const updateTimeStamp = (timeStamps: TimeStamp[], modifiedTimeStamp: Pick<TimeStamp, "id">): TimeStamp[] =>
    pipe(
        timeStamps,
        Arr.findIndex(e => e.id === modifiedTimeStamp.id),
        Option.chain(index =>
            pipe(
                timeStamps,
                Arr.modifyAt(index, e => ({ ...e, ...modifiedTimeStamp }))
            )
        ),
        Option.fold(
            () => timeStamps,
            e => e
        )
    );

export const addRaceCategory = (
    raceCategories: RaceCategory[],
    raceCategory: Omit<RaceCategory, "id">
): RaceCategory[] => pipe(raceCategories, Arr.append({ ...raceCategory, id: getNextId(raceCategories) }));

export const removeRaceCategory = (raceCategories: RaceCategory[], id: number): RaceCategory[] =>
    removeById(raceCategories, id);

export const setConnectionState = (timeKeeperConfig: TimeKeeperConfig, connectionState: ConnectionState) => ({
    ...timeKeeperConfig,
    connectionState
});

export const setTimeOffset = (timeKeeperConfig: TimeKeeperConfig, timeOffset: number) => ({
    ...timeKeeperConfig,
    timeOffset
});

export const setUser = (timeKeeperConfig: UserConfig, user: string) => ({
    ...timeKeeperConfig,
    user
});

export const setTokenExpire = (timeKeeperConfig: UserConfig, tokenExpire: number) => ({
    ...timeKeeperConfig,
    tokenExpire
});

export const chooseTimeKeeper = (timeKeeperConfig: UserConfig, timeKeeperId: number) => ({
    ...timeKeeperConfig,
    timeKeeperId
});
