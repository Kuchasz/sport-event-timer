import {
    addOccurrences,
    areOverlapping,
    arrayRange,
    arraysMatches,
    countById,
    createRange,
    customSort,
    distinctArray,
    excludeItems,
    fillArray,
    findCommonElements,
    getIndexById,
    groupBy,
    hasUndefinedBetweenValues,
    isNotAscendingOrder,
    mapNeighbours,
    limitOccurrences,
    mapWithCount,
    mapWithPrevious,
    naturalSort,
    sort,
    sortDesc,
    sortNumber,
    toLookup,
    toMap,
} from "./array";

describe("areOverlapping", () => {
    test("should return true if the ranges are overlapping", () => {
        const A = { from: 1, to: 5 };
        const B = { from: 3, to: 7 };
        expect(areOverlapping(A, B)).toBe(true);
    });

    test("should return false if the ranges are not overlapping", () => {
        const A = { from: 1, to: 5 };
        const B = { from: 6, to: 10 };
        expect(areOverlapping(A, B)).toBe(false);
    });
});

describe("createRange", () => {
    test("should create a range of numbers", () => {
        const range = { from: 1, to: 5 };
        expect(createRange(range)).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("fillArray", () => {
    test("should create an array of the specified size", () => {
        const size = 5;
        const result = fillArray(size);
        expect(result.length).toBe(size);
    });
});

describe("sort", () => {
    test("should sort the items in ascending order based on the provided function", () => {
        const items = [5, 2, 8, 1, 9];
        const func = (item: number) => item;
        const result = sort(items, func);
        expect(result).toEqual([1, 2, 5, 8, 9]);
    });
});

describe("mapWithCount", () => {
    test("should map the items in the original array with the count", () => {
        const originalArray = [1, 2, 3, 4, 5];
        const selector = (item: number) => item;
        const map = (item: number, count: number) => ({ item, count });
        const result = mapWithCount(originalArray, selector, map);
        expect(result).toEqual([
            { item: 1, count: 0 },
            { item: 2, count: 0 },
            { item: 3, count: 0 },
            { item: 4, count: 0 },
            { item: 5, count: 0 },
        ]);
    });
});

describe("sortDesc", () => {
    test("should sort the items in descending order based on the provided function", () => {
        const items = [5, 2, 8, 1, 9];
        const func = (item: number) => item;
        const result = sortDesc(items, func);
        expect(result).toEqual([9, 8, 5, 2, 1]);
    });
});

describe("countById", () => {
    test("should count the occurrences of each id in the items array", () => {
        const items = [1, 2, 3, 1, 2, 3, 1, 2, 3];
        const selector = (item: number) => item;
        const result = countById(items, selector);
        expect(result).toEqual(
            new Map<number, number>([
                [1, 3],
                [2, 3],
                [3, 3],
            ]),
        );
    });
});

describe("limitOccurrences", () => {
    test("should limit the occurrences of a number in the array", () => {
        const arr = [1, 2, 3, 1, 2, 3, 1, 2, 3];
        const num = 1;
        const limit = 2;
        const result = limitOccurrences(arr, num, limit);
        expect(result).toEqual([1, 2, 3, 1, 2, 3, 2, 3]);
    });
});

describe("addOccurrences", () => {
    test("should add occurrences of a number in the array up to the specified limit", () => {
        const arr = [1, 2, 3, 1, 2, 3];
        const num = 1;
        const limit = 3;
        const result = addOccurrences(arr, num, limit);
        expect(result).toEqual([1, 1, 2, 3, 1, 2, 3]);
    });
});

describe("getIndexById", () => {
    test("should create a map of indices by group id and item id", () => {
        const items = [
            { groupId: 1, id: 1 },
            { groupId: 1, id: 2 },
            { groupId: 2, id: 1 },
            { groupId: 2, id: 2 },
            { groupId: 2, id: 3 },
        ];
        const groupId = (item: { groupId: number; id: number }) => item.groupId;
        const id = (item: { groupId: number; id: number }) => item.id;
        const result = getIndexById(items, groupId, id);
        expect(result).toEqual(
            new Map<number, Record<number, number>>([
                [1, { 1: 0, 2: 1 }],
                [2, { 1: 0, 2: 1, 3: 2 }],
            ]),
        );
    });
});

describe("isNotAscendingOrder", () => {
    test("should return true if the array is not in ascending order based on the provided predicate", () => {
        const arr = [1, 3, 2, 4, 5];
        const predicate = (item: number) => item;
        const result = isNotAscendingOrder(arr, predicate);
        expect(result).toBe(true);
    });

    test("should return false if the array is in ascending order based on the provided predicate", () => {
        const arr = [1, 2, 3, 4, 5];
        const predicate = (item: number) => item;
        const result = isNotAscendingOrder(arr, predicate);
        expect(result).toBe(false);
    });
});

describe("hasUndefinedBetweenValues", () => {
    test("should return true if there is an undefined value between non-undefined values in the array", () => {
        const items = [1, undefined, 2, 3];
        const predicate = (item: number | undefined) => item;
        const result = hasUndefinedBetweenValues(items, predicate);
        expect(result).toBe(true);
    });

    test("should return false if there are no undefined values between non-undefined values in the array", () => {
        const items = [1, 2, 3];
        const predicate = (item: number | undefined) => item;
        const result = hasUndefinedBetweenValues(items, predicate);
        expect(result).toBe(false);
    });
});

describe("customSort", () => {
    test("should sort the items based on the provided string predicate", () => {
        const items = ["1.2", "1.1", "2.3", "2.1", "1.3"];
        const pred = (item: string) => item;
        const result = customSort(items, pred);
        expect(result).toEqual(["1.1", "1.2", "1.3", "2.1", "2.3"]);
    });
});

describe("sortNumber", () => {
    test("should sort the items in ascending order based on the provided number function", () => {
        const items = [5, 2, 8, 1, 9];
        const order = "asc";
        const func = (item: number) => item;
        const result = sortNumber(items, order, func);
        expect(result).toEqual([1, 2, 5, 8, 9]);
    });

    test("should sort the items in descending order based on the provided number function", () => {
        const items = [5, 2, 8, 1, 9];
        const order = "desc";
        const func = (item: number) => item;
        const result = sortNumber(items, order, func);
        expect(result).toEqual([9, 8, 5, 2, 1]);
    });
});

describe("naturalSort", () => {
    test("should sort the items in ascending order based on the provided string function", () => {
        const items = ["item1", "item10", "item2", "item3"];
        const order = "asc";
        const func = (item: string) => item;
        const result = naturalSort(items, order, func);
        expect(result).toEqual(["item1", "item2", "item3", "item10"]);
    });

    test("should sort the items in descending order based on the provided string function", () => {
        const items = ["item1", "item10", "item2", "item3"];
        const order = "desc";
        const func = (item: string) => item;
        const result = naturalSort(items, order, func);
        expect(result).toEqual(["item10", "item3", "item2", "item1"]);
    });
});

describe("toMap", () => {
    test("should convert the array to a map using the provided key and value selectors", () => {
        const array = [
            { id: 1, name: "John" },
            { id: 2, name: "Jane" },
        ];
        const keySelector = (obj: { id: number; name: string }) => obj.id;
        const valueSelector = (obj: { id: number; name: string }) => obj.name;
        const result = toMap(array, keySelector, valueSelector);
        expect(result).toEqual({
            1: "John",
            2: "Jane",
        });
    });
});

describe("toLookup", () => {
    test("should convert the array to a lookup object using the provided key and value selectors", () => {
        const array = [
            { id: 1, name: "John" },
            { id: 2, name: "Jane" },
        ];
        const keySelector = (obj: { id: number; name: string }) => obj.name;
        const valueSelector = (obj: { id: number; name: string }) => ({ id: obj.id });
        const result = toLookup(array, keySelector, valueSelector);
        expect(result).toEqual({
            John: [{ id: 1, key: "John" }],
            Jane: [{ id: 2, key: "Jane" }],
        });
    });
});

describe("arrayRange", () => {
    test("should create an array with numbers in the specified range", () => {
        const startNumber = 1;
        const endNumber = 5;
        const result = arrayRange(startNumber, endNumber);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("groupBy", () => {
    test("should group the items in the array based on the provided key function", () => {
        const items = [
            { id: 1, group: "A" },
            { id: 2, group: "A" },
            { id: 3, group: "B" },
            { id: 4, group: "B" },
            { id: 5, group: "C" },
        ];
        const key = (item: { id: number; group: string }) => item.group;
        const result = groupBy(items, key);
        expect(result).toEqual({
            A: [
                { id: 1, group: "A" },
                { id: 2, group: "A" },
            ],
            B: [
                { id: 3, group: "B" },
                { id: 4, group: "B" },
            ],
            C: [{ id: 5, group: "C" }],
        });
    });
});

describe("excludeItems", () => {
    test("should exclude the specified items from the array", () => {
        const array = [1, 2, 3, 4, 5];
        const itemsToExclude = [2, 4];
        const result = excludeItems(array, itemsToExclude);
        expect(result).toEqual([1, 3, 5]);
    });
});

describe("findCommonElements", () => {
    test("should find the common elements between two arrays", () => {
        const arr1 = [1, 2, 3, 4, 5];
        const arr2 = [3, 4, 5, 6, 7];
        const result = findCommonElements(arr1, arr2);
        expect(result).toEqual([3, 4, 5]);
    });
});

describe("arraysMatches", () => {
    test("should return true if the two arrays have the same elements", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [3, 2, 1];
        const result = arraysMatches(arr1, arr2);
        expect(result).toBe(true);
    });

    test("should return false if the two arrays do not have the same elements", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];
        const result = arraysMatches(arr1, arr2);
        expect(result).toBe(false);
    });
});

describe("mapWithPrevious", () => {
    test("should map the items in the array with the previous item", () => {
        const array = [1, 2, 3, 4, 5];
        const mapper = (current: number, previous: number | undefined) => ({ current, previous });
        const result = mapWithPrevious(array, mapper);
        expect(result).toEqual([
            { current: 1, previous: undefined },
            { current: 2, previous: 1 },
            { current: 3, previous: 2 },
            { current: 4, previous: 3 },
            { current: 5, previous: 4 },
        ]);
    });
});

describe("distinctArray", () => {
    test("should return an array with distinct elements", () => {
        const array = [1, 2, 3, 2, 1, 4, 5, 4];
        const result = distinctArray(array);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("mapNeighbours", () => {
    test("should return an array with the specified item and its neighbors", () => {
        const array = [1, 2, 3, 4, 5];
        const itemId = 3;
        const idSelector = (item: number) => item;
        const result = mapNeighbours(array, itemId, idSelector);
        expect(result).toEqual([3, 2, 4, 1, 5]);
    });

    test("should return an empty array if the specified item is not found in the array", () => {
        const array = [1, 2, 3, 4, 5];
        const itemId = 6;
        const idSelector = (item: number) => item;
        const result = mapNeighbours(array, itemId, idSelector);
        expect(result).toEqual([]);
    });
});
