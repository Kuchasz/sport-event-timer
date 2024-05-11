import { rangeLength } from "./number";

export const areOverlapping = (A: { from: number; to: number }, B: { from: number; to: number }) => {
    if (B.from <= A.from) {
        return B.to >= A.from;
    } else {
        return B.from <= A.to;
    }
};

export const createRange = (range: { from: number; to: number }) => Array.from({ length: rangeLength(range) }, (_, i) => range.from + i);
export const fillArray = (size: number) => Array.from({ length: size }, (_, i) => i);

export const sort = <T>(items: T[], func: (item: T) => number): T[] => {
    const i = [...items];

    return i.sort((a, b) => func(a) - func(b));
};

export const mapWithCount = <T, U>(originalArray: T[], selector: (item: T) => number, map: (item: T, count: number) => U): U[] => {
    const occurencesMap = new Map<number, number>();

    const processedArray: U[] = [];

    for (const item of originalArray) {
        const id = selector(item);
        const occurrence = occurencesMap.get(id) || 0;
        occurencesMap.set(id, occurrence + 1);
        processedArray.push(map(item, occurrence));
    }

    return processedArray;
};

export const sortDesc = <T>(items: T[], func: (item: T) => number): T[] => {
    const i = [...items];

    return i.sort((a, b) => func(b) - func(a));
};

export const countById = <T>(items: T[], selector: (item: T) => number): Map<number, number> => {
    return items.reduce((idCountMap, item) => {
        const id = selector(item);
        idCountMap.set(id, (idCountMap.get(id) || 0) + 1);
        return idCountMap;
    }, new Map<number, number>());
};

export const limitOccurrences = (arr: number[], num: number, limit: number): number[] => {
    let count = 0;
    const newArr: number[] = [];
    for (const item of arr) {
        if (item === num) {
            count++;
            if (count > limit) {
                continue;
            }
        }
        newArr.push(item);
    }
    return newArr;
};

export const addOccurrences = (arr: number[], num: number, limit: number): number[] => {
    const newArr: number[] = [];
    let count = 0;
    let lastSixIndex = -1;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 6) {
            newArr.push(arr[i]);
            lastSixIndex = i;
        } else {
            newArr.push(arr[i]);
            if (arr[i] === num) {
                count++;
                if (count >= limit) {
                    break;
                }
            }
        }
    }

    const remainingOccurrences = limit - count;
    for (let i = 0; i < remainingOccurrences; i++) {
        newArr.splice(lastSixIndex + 1 + i, 0, num);
    }

    return newArr;
};

export const getIndexById = <T>(items: T[], groupId: (item: T) => number, id: (item: T) => number): Map<number, Record<number, number>> => {
    return items.reduce((idTimesMap, item) => {
        const groupKey = groupId(item);
        const key = id(item);

        if (!idTimesMap.has(groupKey)) {
            idTimesMap.set(groupKey, {});
        }

        // splitTime with higher id may have lower time than those with lower ids , times may be edited!

        const timeIndexMap = idTimesMap.get(groupKey)!;
        timeIndexMap[key] = Object.keys(timeIndexMap).length;

        return idTimesMap;
    }, new Map<number, Record<number, number>>());
};

export const isNotAscendingOrder = <T>(arr: T[], predicate: (item: T) => number): boolean => {
    for (let i = 0; i < arr.length - 1; i++) {
        if (!(predicate(arr[i]) <= predicate(arr[i + 1]))) {
            return true;
        }
    }
    return false;
};

export const hasUndefinedBetweenValues = <T>(items: T[], predicate: (item: T) => number | undefined) => {
    let alreadyFoundUndefined = false;

    for (const item of items) {
        if (predicate(item) === undefined) {
            alreadyFoundUndefined = true;
        } else if (alreadyFoundUndefined) {
            // If undefined occurred before a non-undefined value, return false
            return true;
        }
    }

    // If the loop completes without issues, return true
    return false;
};

export const customSort = <T>(items: T[], pred: (item: T) => string): T[] => {
    return items.sort((a, b) => {
        const [aBeforeDot, aAfterDot] = pred(a).split(".").map(Number);
        const [bBeforeDot, bAfterDot] = pred(b).split(".").map(Number);

        // First, compare by the number before the dot
        if (aBeforeDot !== bBeforeDot) {
            return aBeforeDot - bBeforeDot;
        }

        // If the number before the dot is the same, compare by the second number
        return aAfterDot - bAfterDot;
    });
};

export const sortNumber = <T>(items: T[], order: "desc" | "asc", func: (item: T) => number): T[] => {
    const i = [...items];

    return order === "asc" ? i.sort((a, b) => func(a) - func(b)) : i.sort((a, b) => func(b) - func(a));
};

export const naturalSort = <T>(items: T[], order: "desc" | "asc", func: (item: T) => string): T[] => {
    const i = [...items];

    return order === "asc"
        ? i.sort((a, b) => func(a).localeCompare(func(b), undefined, { numeric: true }))
        : i.sort((a, b) => func(b).localeCompare(func(a), undefined, { numeric: true }));
};

export const toMap = <T, TK extends string | number, U>(array: T[], keySelector: (obj: T) => TK, valueSelector: (obj: T) => U) => {
    return Object.fromEntries(array.map(r => [keySelector(r), valueSelector(r)])) as Record<TK, U>;
};

export const toLookup = <T, TV>(array: T[], keySelector: (obj: T) => string, valueSelector: (obj: T) => TV) => {
    const elements = array;

    const foo = elements.map(r => ({ key: keySelector(r), ...valueSelector(r) }));

    return groupBy(foo, x => x.key);
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

export const findCommonElements = <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(element => arr2.includes(element));
};

export const arraysMatches = <T>(arr1: T[], arr2: T[]): boolean => {
    return arr2.every(element => arr1.includes(element)) && arr1.every(element => arr2.includes(element));
};

type Mapper<T, U> = (current: T, previous: T | undefined, index: number) => U;

export const mapWithPrevious = <T, U>(array: T[], mapper: Mapper<T, U>): U[] => {
    return array.reduce((acc: U[], current: T, index: number) => {
        const previous = index > 0 ? array[index - 1] : undefined;
        acc.push(mapper(current, previous, index));
        return acc;
    }, []);
};
