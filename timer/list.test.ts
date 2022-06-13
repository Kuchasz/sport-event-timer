import { assignNumbersToPlayers, ClassificationConfig } from "./list";

const pro = (name: string, lastName: string) => ({ C: "Race PRO", name, lastName });
const fun = (name: string, lastName: string) => ({ C: "Race FUN", name, lastName });

test("empty", () => {
    expect(
        assignNumbersToPlayers(
            [],
            [],
            [],
            () => "",
            () => "",
            false
        )
    ).toEqual({ type: "Success", playersNumbers: [] });
});

test("error | ranges overlap", () => {
    const classifications: ClassificationConfig[] = [
        { name: "Race PRO", excludes: ["Race FUN"], range: { from: 1, to: 10 } },
        { name: "Race FUN", excludes: ["Race PRO"], range: { from: 10, to: 20 } }
    ];

    const players = [pro("John", "Doe")];

    expect(
        assignNumbersToPlayers(
            players,
            [],
            classifications,
            c => c.lastName + c.name,
            c => c.C,
            false
        )
    ).toEqual({ type: "Error", errorType: "RangesOverlap", playersNumbers: [] });
});

test("error | range exceeded", () => {
    const classifications: ClassificationConfig[] = [
        { name: "Race PRO", excludes: [], range: { from: 1, to: 2 } },
        { name: "Race FUN", excludes: [], range: { from: 11, to: 20 } }
    ];

    const players = [pro("John", "Doe"), pro("Alice", "Doe"), pro("Danny", "Doe"), pro("Barry", "Doe")];

    expect(
        assignNumbersToPlayers(
            players,
            [],
            classifications,
            c => c.lastName + c.name,
            c => c.C,
            false
        )
    ).toEqual({ type: "Error", errorType: "RangesExceeded", playersNumbers: [] });
});

test("error | range exceeded with excluded numbers", () => {
    const classifications: ClassificationConfig[] = [
        { name: "Race PRO", excludes: [], range: { from: 1, to: 5 } },
        { name: "Race FUN", excludes: [], range: { from: 11, to: 20 } }
    ];

    const players = [pro("John", "Doe"), pro("Alice", "Doe"), pro("Danny", "Doe"), pro("Barry", "Doe")];

    expect(
        assignNumbersToPlayers(
            players,
            [1, 2],
            classifications,
            c => c.lastName + c.name,
            c => c.C,
            false
        )
    ).toEqual({ type: "Error", errorType: "RangesExceeded", playersNumbers: [] });
});

test("error | exclutions violated", () => {
    const classifications: ClassificationConfig[] = [
        { name: "Race PRO", excludes: ["Race FUN"], range: { from: 1, to: 10 } },
        { name: "Race FUN", excludes: ["Race PRO"], range: { from: 11, to: 20 } }
    ];

    const players = [pro("John", "Doe"), fun("John", "Doe")];

    expect(
        assignNumbersToPlayers(
            players,
            [],
            classifications,
            c => c.lastName + c.name,
            c => c.C,
            false
        )
    ).toEqual({ type: "Error", errorType: "ExcludesViolated", playersNumbers: [] });
});

test("no exclutions | no unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { name: "Race PRO", excludes: [], range: { from: 1, to: 10 } },
        { name: "Race FUN", excludes: [], range: { from: 11, to: 20 } }
    ];

    const players = [pro("John", "Doe"), fun("John", "Doe")];

    expect(
        assignNumbersToPlayers(
            players,
            [],
            classifications,
            c => c.lastName + c.name,
            c => c.C,
            false
        )
    ).toEqual({
        type: "Success",
        playersNumbers: [
            ["DoeJohn", 1],
            ["DoeJohn", 11]
        ]
    });
});

test("no exclutions | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { name: "Race PRO", excludes: [], range: { from: 1, to: 10 } },
        { name: "Race FUN", excludes: [], range: { from: 11, to: 20 } }
    ];

    const players = [pro("John", "Doe"), fun("John", "Doe")];

    expect(
        assignNumbersToPlayers(
            players,
            [],
            classifications,
            c => c.lastName + c.name,
            c => c.C,
            false
        )
    ).toEqual({
        type: "Success",
        playersNumbers: [["DoeJohn", 1]]
    });
});
