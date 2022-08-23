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
    // id: number;
    name: string;
    lastName: string;
    bibNumber: number;
    // birthYear: number;
    // gender: Gender;
    // city: string;
    // raceCategory: string;
    // team: string;
    // country: string;
    startTime?: number;
};

export type RaceCategory = {
    id: number;
    name: string;
    minAge?: number;
    maxAge?: number;
    gender?: Gender;
};

export type TimeKeeper = {
    id: number;
    name: string;
    order: number;
};

export type ConnectionState = "connected" | "connecting" | "disconnected" | "error";

export type HistoricAction = {
    issuer: string;
    issuedAt: number;
    action: { type: string; payload: any };
};

export type TimeStamp = {
    id: number;
    bibNumber?: number;
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
    Option.fold(() => 1, increment)
);

export const filterBy = <T>(items: T[], func: (item: T) => boolean) => pipe(items, Arr.filter(func));

export const removeById = <T extends { id: number }>(items: T[], id: number) => filterBy(items, item => item.id !== id);

export const updateBy = <T>(items: T[], item: Partial<T>, func: (item: Partial<T>) => boolean) =>
    pipe(
        items,
        Arr.findIndex(e => func(e) === func(item)),
        Option.chain(index =>
            pipe(
                items,
                Arr.modifyAt(index, e => ({ ...e, ...item }))
            )
        ),
        Option.fold(
            () => items,
            e => e
        )
    );

export const updateItem = <T extends { id: number }>(items: T[], item: Partial<T>) =>
    updateBy(items, item, i => i.id === item.id);

export const uploadPlayers = (_players: Player[], newPlayers: Player[]): Player[] => newPlayers;

export const addTimeKeeper = (timeKeepers: TimeKeeper[], newTimeKeeper: TimeKeeper): TimeKeeper[] =>
    pipe(timeKeepers, Arr.append({ ...newTimeKeeper }));

// export const addTimeKeeper = (timeKeepers: TimeKeeper[], newTimeKeeper: Omit<TimeKeeper, "id">): TimeKeeper[] =>
//     pipe(timeKeepers, Arr.append({ ...newTimeKeeper, id: getNextId(timeKeepers) }));

export const updateTimeKeeper = (timeKeepers: TimeKeeper[], modifiedTimeKeeper: Partial<TimeKeeper>): TimeKeeper[] =>
    updateItem(timeKeepers, modifiedTimeKeeper);

export const removeTimeKeeper = (timeKeepers: TimeKeeper[], id: number): TimeKeeper[] => removeById(timeKeepers, id);

export const addTimeStamp = (timeStamps: TimeStamp[], timeStamp: Omit<TimeStamp, "id">): TimeStamp[] =>
    pipe(timeStamps, Arr.append({ ...timeStamp, id: getNextId(timeStamps) }));

export const addHistoricAction = (historicActions: HistoricAction[], action: HistoricAction): HistoricAction[] =>
    pipe(historicActions, Arr.append({ ...action }));

export const resetTimeStamp = (timeStamps: TimeStamp[], id: number): TimeStamp[] => removeById(timeStamps, id);

export const updateTimeStamp = (timeStamps: TimeStamp[], modifiedTimeStamp: Partial<TimeStamp>): TimeStamp[] =>
    updateItem(timeStamps, modifiedTimeStamp);

export const addRaceCategory = (
    raceCategories: RaceCategory[],
    raceCategory: Omit<RaceCategory, "id">
): RaceCategory[] => pipe(raceCategories, Arr.append({ ...raceCategory, id: getNextId(raceCategories) }));

export const removeRaceCategory = (raceCategories: RaceCategory[], id: number): RaceCategory[] =>
    removeById(raceCategories, id);
