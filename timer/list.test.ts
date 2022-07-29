import { assignNumbersToPlayers, ClassificationConfig, transform } from "./list";
import { Gender } from "./model";
import { ToStartPlayer, toStartPlayerTransform } from "./to-start";

const pro = (name: string, lastName: string) => ({ classificationId: "race_pro", name, lastName });
const fun = (name: string, lastName: string) => ({ classificationId: "race_fun", name, lastName });
const getPlayerId = (player: { name: string; lastName: string }) => player.lastName + player.name;

test("empty", () => {
    const result = assignNumbersToPlayers(
        [],
        [],
        [],
        () => "",
        () => ""
    );

    expect(result).toEqual({ type: "Success", playersNumbers: [] });
});

test("error | ranges overlap", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: ["race_fun"], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: ["race_pro"], range: { from: 10, to: 20 } }
    ];

    const result = assignNumbersToPlayers(
        [],
        [],
        classifications,
        () => "",
        () => ""
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
        playersNumbers: []
    });
});

test("error | range exceeded", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 2 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } }
    ];
    const players = [pro("John", "Doe"), pro("Alice", "Doe"), pro("Danny", "Doe"), pro("Barry", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "RangesExceeded",
        playersNumbers: []
    });
});

test("error | range exceeded with excluded numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 5 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } }
    ];
    const players = [pro("John", "Doe"), pro("Alice", "Doe"), pro("Danny", "Doe"), pro("Barry", "Doe")];

    const result = assignNumbersToPlayers(players, [1, 2], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "RangesExceeded",
        playersNumbers: []
    });
});

test("error | exclutions violated", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: ["race_fun"], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: ["race_pro"], range: { from: 11, to: 20 } }
    ];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Error",
        errorType: "ExcludesViolated",
        playersNumbers: []
    });
});

test("no exclutions duplicate player | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } }
    ];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [["DoeJohn", 1]]
    });
});

test("no exclutions no duplicate player | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } }
    ];
    const players = [pro("John", "Doe"), fun("Josh", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [
            ["DoeJohn", 1],
            ["DoeJosh", 11]
        ]
    });
});

test("forbidden numbers | unique numbers", () => {
    const classifications: ClassificationConfig[] = [
        { id: "race_pro", excludes: [], range: { from: 1, to: 10 } },
        { id: "race_fun", excludes: [], range: { from: 11, to: 20 } }
    ];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(
        players,
        [1, 2, 3, 11, 13],
        classifications,
        getPlayerId,
        c => c.classificationId
    );

    expect(result).toEqual({
        type: "Success",
        playersNumbers: [["DoeJohn", 4]]
    });
});

test("no classifications | empty", () => {
    const classifications: ClassificationConfig[] = [];
    const players = [pro("John", "Doe"), fun("John", "Doe")];

    const result = assignNumbersToPlayers(players, [], classifications, getPlayerId, c => c.classificationId);

    expect(result).toEqual({
        type: "Success",
        playersNumbers: []
    });
});

test("transformed properly | to start", () => {
    const classifications = [{ name: "RnK PRO", id: "rnk_pro" }];
    const tsPlayer: Partial<ToStartPlayer> = {
        "Adres email": "A.brzozka@jbg2.pl",
        "Data urodzenia": "09.07.1987",
        "Nazwa klubu": "JBG2",
        "Telefon ICE": "536225567",
        Imię: "Adrian",
        Klasyfikacja: "RnK PRO",
        Miasto: "Ustroń",
        Nazwisko: "Brzozka",
        Państwo: "POL",
        Płeć: "M",
        Telefon: "536225567"
    };

    const result = transform([tsPlayer], toStartPlayerTransform(classifications));

    expect(result).toStrictEqual([
        {
            birthDate: new Date("1987-07-09"),
            city: "Ustroń",
            classificationId: "rnk_pro",
            country: "POL",
            email: "A.brzozka@jbg2.pl",
            gender: "male",
            icePhoneNumber: "536225567",
            lastName: "Brzozka",
            name: "Adrian",
            phoneNumber: "536225567",
            team: "JBG2"
        }
    ]);
});
