import * as Arr from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as Option from "fp-ts/Option";
import * as Ord from "fp-ts/Ord";
import { flow, increment, pipe } from "fp-ts/function";

export type Player = {
    name: string;
    lastName: string;
    bibNumber: number;
    startTime?: number;
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
    timingPointId: number;
    time: number;
};

export type Absence = {
    id: number;
    bibNumber: number;
    timingPointId: number;
};

export type State = {
    timeStamps: TimeStamp[];
};

export type RaceResult = {
    player: Omit<Player, "id">;
    timeStamps: Record<number, number>;
};

export type RaceResults = RaceResult[];

export const getNextId = flow(
    Arr.sortBy([
        pipe(
            N.Ord,
            Ord.contramap((e: { id: number }) => e.id),
        ),
    ]),
    Arr.last,
    Option.map(e => e.id),
    Option.fold(() => 1, increment),
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
                Arr.modifyAt(index, e => ({ ...e, ...item })),
            ),
        ),
        Option.fold(
            () => items,
            e => e,
        ),
    );

export const updateItem = <T extends { id: number }>(items: T[], item: Partial<T>) => updateBy(items, item, i => i.id === item.id);

export const addTimeStamp = (timeStamps: TimeStamp[], timeStamp: Omit<TimeStamp, "id">): TimeStamp[] =>
    pipe(timeStamps, Arr.append({ ...timeStamp, id: getNextId(timeStamps) }));

export const addHistoricAction = (historicActions: HistoricAction[], action: HistoricAction): HistoricAction[] =>
    pipe(historicActions, Arr.append({ ...action }));

export const resetTimeStamp = (timeStamps: TimeStamp[], id: number): TimeStamp[] => removeById(timeStamps, id);

export const updateTimeStamp = (timeStamps: TimeStamp[], modifiedTimeStamp: Partial<TimeStamp>): TimeStamp[] =>
    updateItem(timeStamps, modifiedTimeStamp);

export const addAbsence = (absences: Absence[], absence: Omit<Absence, "id">): Absence[] =>
    pipe(absences, Arr.append({ ...absence, id: getNextId(absences) }));

export const resetAbsence = (absences: Absence[], id: number): Absence[] => removeById(absences, id);
