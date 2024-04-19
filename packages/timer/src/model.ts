import { sort } from "@set/utils/dist/array";

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

export type SplitTime = {
    id: number;
    bibNumber?: number;
    splitId?: number;
    timingPointId: number;
    time: number;
};

export type Absence = {
    id: number;
    bibNumber: number;
    timingPointId: number;
};

export type State = {
    splitTimes: SplitTime[];
};

export type RaceResult = {
    player: Omit<Player, "id">;
    splitTimes: Record<number, number>;
};

export type RaceResults = RaceResult[];

export const getNextId = <T extends { id: number }>(items: T[]) => (sort(items, item => item.id).at(-1)?.id ?? 0) + 1;

export const filterBy = <T>(items: T[], func: (item: T) => boolean) => items.filter(func);

export const removeById = <T extends { id: number }>(items: T[], id: number) => filterBy(items, item => item.id !== id);

export const updateBy = <T>(items: T[], item: Partial<T>, func: (item: Partial<T>) => boolean) =>
    items.map(e => (func(e) === func(item) ? { ...e, ...item } : e));

export const updateItem = <T extends { id: number }>(items: T[], item: Partial<T>) => updateBy(items, item, i => i.id === item.id);

export const addSplitTime = (splitTimes: SplitTime[], splitTime: Omit<SplitTime, "id">): SplitTime[] => [
    ...splitTimes,
    { ...splitTime, id: getNextId(splitTimes) },
];

export const addHistoricAction = (historicActions: HistoricAction[], action: HistoricAction): HistoricAction[] => [
    ...historicActions,
    { ...action },
];

export const resetSplitTime = (splitTimes: SplitTime[], id: number): SplitTime[] => removeById(splitTimes, id);

export const updateSplitTime = (splitTimes: SplitTime[], modifiedSplitTime: Partial<SplitTime>): SplitTime[] =>
    updateItem(splitTimes, modifiedSplitTime);

export const addAbsence = (absences: Absence[], absence: Omit<Absence, "id">): Absence[] => [
    ...absences,
    { ...absence, id: getNextId(absences) },
];

export const resetAbsence = (absences: Absence[], id: number): Absence[] => removeById(absences, id);
