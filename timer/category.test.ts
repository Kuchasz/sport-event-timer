import {
    AgeCategory,
    getAgeAtEventDate,
    getCategoryMatchers,
    matchPlayersToCategories
    } from "./category";
import { Gender } from "./model";

test("empty", () => {
    const result = getCategoryMatchers([]);

    expect(result).toEqual({ type: "Success", categoryMatchers: [] });
});

test("error | the same gender ranges overlap", () => {
    const categories: AgeCategory[] = [
        { name: "M20", gender: "male", range: { from: 18, to: 30 } },
        { name: "M30", gender: "male", range: { from: 30, to: 40 } }
    ];

    const result = getCategoryMatchers(categories);

    expect(result).toEqual({ type: "Error", errorType: "RangesOverlap", categoryMatchers: [] });
});

test("category matchers | the same gender without ranges overlap", () => {
    const categories: AgeCategory[] = [
        { name: "M20", gender: "male", range: { from: 18, to: 29 } },
        { name: "M30", gender: "male", range: { from: 30, to: 39 } }
    ];

    const result = getCategoryMatchers(categories);

    expect(result).toEqual({
        type: "Success",
        categoryMatchers: [
            { name: "M20", fitsCategory: expect.any(Function) },
            { name: "M30", fitsCategory: expect.any(Function) }
        ]
    });
});

test("category matchers | different gender ranges overlap", () => {
    const categories: AgeCategory[] = [
        { name: "M20", gender: "male", range: { from: 18, to: 30 } },
        { name: "K30", gender: "female", range: { from: 30, to: 40 } }
    ];

    const result = getCategoryMatchers(categories);

    expect(result).toEqual({
        type: "Success",
        categoryMatchers: [
            { name: "M20", fitsCategory: expect.any(Function) },
            { name: "K30", fitsCategory: expect.any(Function) }
        ]
    });
});

test("calculated categories | all players with categories", () => {
    const categories: AgeCategory[] = [
        {
            name: "M18-29",
            gender: "male",
            range: { from: 18, to: 29 }
        },
        {
            name: "M30-39",
            gender: "male",
            range: { from: 30, to: 39 }
        }
    ];
    const players = [
        { id: 1, birthDate: new Date(1992, 10, 10), gender: "male" as Gender },
        { id: 2, birthDate: new Date(1993, 8, 8), gender: "male" as Gender }
    ];
    const eventDate = new Date(2022, 4, 4);
    const categoryMatchers = getCategoryMatchers(categories).categoryMatchers;

    const result = matchPlayersToCategories(eventDate, players, categoryMatchers);

    expect(result).toEqual([
        [1, "M30-39"],
        [2, "M18-29"]
    ]);
});

test("calculated categories | players without category", () => {
    const categories: AgeCategory[] = [
        {
            name: "M50-59",
            gender: "male",
            range: { from: 50, to: 59 }
        }
    ];
    const players = [
        { id: 1, birthDate: new Date(1992, 10, 10), gender: "male" as Gender },
        { id: 2, birthDate: new Date(1993, 8, 8), gender: "male" as Gender }
    ];
    const eventDate = new Date(2022, 4, 4);
    const categoryMatchers = getCategoryMatchers(categories).categoryMatchers;

    const result = matchPlayersToCategories(eventDate, players, categoryMatchers);

    expect(result).toEqual([
        [1, undefined],
        [2, undefined]
    ]);
});

test("age calculated", () => {
    const birthDate = new Date(1992, 0, 1);
    const eventDate = new Date(2022, 0, 1);

    const result = getAgeAtEventDate(eventDate, birthDate);

    expect(result).toBe(30);
});
