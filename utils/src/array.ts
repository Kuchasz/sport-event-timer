import { rangeLength } from "./number";

export const areOverlapping = (A: { from: number; to: number }, B: { from: number; to: number }) => {
    if (B.from <= A.from) {
        return B.to >= A.from;
    } else {
        return B.from <= A.to;
    }
};

export const createRange = (range: { from: number; to: number }) => Array.from({ length: rangeLength(range) }, (_, i) => range.from + i);

export const sort = <T>(items: T[], func: (item: T) => number): T[] => {
    const i = [...items];

    return i.sort((a, b) => func(a) - func(b));
};

export const sortDesc = <T>(items: T[], func: (item: T) => number): T[] => {
    const i = [...items];

    return i.sort((a, b) => func(b) - func(a));
};

export const arrayRange = (startNumber: number, endNumber: number) =>
    [...Array(1 + endNumber - startNumber).keys()].map(v => startNumber + v);

export const groupBy = <TItem, TKey extends string | number>(xs: TItem[], key: (item: TItem) => TKey): { [key in TKey]: TItem[] } => {
    return xs.reduce((rv: Record<string | number, TItem[]>, x: TItem) => {
        (rv[key(x)] = rv[key(x)] || []).push(x);
        return rv;
    }, {}) as { [key in TKey]: TItem[] };
};

export const excludeItems = <T>(array: T[], itemsToExclude: T[]): T[] => {
    return array.filter(item => !itemsToExclude.includes(item));
};
