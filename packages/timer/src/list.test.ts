import type { ClassificationConfig } from "./list";
import { assignNumbersToPlayers } from "./list";

const pro = (name: string, lastName: string) => ({ classificationId: "race_pro", name, lastName });
const fun = (name: string, lastName: string) => ({ classificationId: "race_fun", name, lastName });
const getPlayerId = (player: { name: string; lastName: string }) => player.lastName + player.name;

test("empty", () => {
    const result = assignNumbersToPlayers(
        [],
        [],
        [],
        () => "",
        () => "",
    );

    expect(result).toEqual({ type: "Success", playersNumbers: [] });
});

test("error | ranges overlap", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: ["race_fun"], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: ["race_pro"], range: { from: 10, to: 20 } },
    ];

    const result = assignNumbersToPlayers(
        [],
        [],
        classifications,
        () => "",
        () => "",
    );

    expect(result).toEqual({ type: "Error", errorType: "RangesOverlap", playersNumbers: [] });
});

test("error | duplicated players", () => {
    const classifications: ClassificationConfig[] = [{ id: "race_pro", excludes: [], range: { from: 1, to: 10 } }];
    const players = [pro("John", "Doe"), pro("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "DuplicatedPlayers",
        playersNumbers: [],
    });
});

test("error | range exceeded", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 2 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } },
    ];
    const players = [pro("John", "Doe"), pro("Alice", "Doe"), pro("Danny", "Doe"), pro("Barry", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "RangesExceeded",
        playersNumbers: [],
    });
});

test("error | range exceeded with excluded numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 5 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } },
    ];
    const players = [pro("John", "Doe"), pro("Alice", "Doe"), pro("Danny", "Doe"), pro("Barry", "Doe")];

    const result = assignNumbersToPlayers(players, [1, 2], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "RangesExceeded",
        playersNumbers: [],
    });
});

test("error | exclutions violated", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: ["race_fun"], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: ["race_pro"], range: { from: 11, to: 20 } },
    ];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "ExcludesViolated",
        playersNumbers: [],
    });
});

test("no exclutions duplicate player | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } },
    ];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [["DoeJohn", 1]],
    });
});

test("no exclutions no duplicate player | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } },
    ];
    const players = [pro("John", "Doe"), fun("Josh", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [
            ["DoeJohn", 1],
            ["DoeJosh", 11],
        ],
    });
});

test("forbidden numbers | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } },
    ];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [1, 2, 3, 11, 13], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [["DoeJohn", 4]],
    });
});

test("no classifications | empty", () => {
    const classifications: ClassificationConfig[] = [];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [],
    });
});
