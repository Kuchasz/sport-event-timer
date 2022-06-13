import { arrayRange, uuidv4 } from "@set/shared";
import { ToStartPlayer } from "./to-start";

export type ClassificationConfig = {
    name: string;
    excludes: string[];
    range: { from: number; to: number };
};

type AssignmentResult<Id> = {
    type: "Success" | "Error";
    errorType?: "RangesOverlap" | "RangesExceeded" | "ExcludesViolated";
    playersNumbers: [Id, number][];
};

export const assignNumbersToPlayers = <T>(
    paidPlayers: T[],
    forbiddenNumbers: number[],
    classifications: ClassificationConfig[],
    getPlayerId: (player: T) => string,
    getClassification: (player: T) => string,
    uniqueNumbers: boolean
): AssignmentResult<string> => {
    // const paidPlayers = parsedPlayers
    //     .filter(p => p["Status opłaty"] === "Opłacony")
    //     .map(p => ({
    //         ...p,
    //         uid: uuidv4(),
    //         playerId: getPlayerId(p)
    //     }));

    // let potentialNumbers = arrayRange(1, 1000)
    //     .filter(pn => forbiddenNumbers.includes(pn) === false)
    //     .reverse();

    const areOverlapping = (A: { from: number; to: number }, B: { from: number; to: number }) => {
        if (B.from <= A.from) {
            return B.to >= A.from;
        } else {
            return B.from <= A.to;
        }
    };

    const inRange = (range: { from: number; to: number }, n: number) => range.from <= n && range.to >= n;

    const rangeLength = (range: { from: number; to: number }) => range.to - range.from;

    const createRange = (range: { from: number; to: number }) =>
        Array.from({ length: rangeLength(range) }, (x, i) => range.from + i);

    const rangesOverlapping = classifications
        .flatMap(c => classifications.filter(cc => c.name !== cc.name).map(cc => areOverlapping(c.range, cc.range)))
        .some(isOverlapping => isOverlapping === true);

    if (rangesOverlapping)
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "RangesOverlap"
        };

    const classificationsWithPlayers = classifications.map(c => ({
        ...c,
        numbers: createRange(c.range),
        players: paidPlayers.filter(p => getClassification(p) === c.name).map(p => ({ ...p, playerId: getPlayerId(p) }))
    }));

    const notEnoughSlots = classificationsWithPlayers.some(
        c => rangeLength(c.range) - forbiddenNumbers.filter(f => inRange(c.range, f)).length < c.players.length
    );
    if (notEnoughSlots)
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "RangesExceeded"
        };

    const excludesToCheck = classificationsWithPlayers.flatMap(c =>
        c.excludes.map(excluded => ({
            setA: { name: c.name, players: c.players.map(p => p.playerId) },
            setB: {
                name: excluded,
                players: classificationsWithPlayers.find(cc => cc.name === excluded)!.players.map(p => p.playerId)
            }
        }))
    );

    const anyExcludesViolated = excludesToCheck.some(e => e.setA.players.some(pa => e.setB.players.includes(pa)));

    if (anyExcludesViolated)
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "ExcludesViolated"
        };

    const playersNumbers = classificationsWithPlayers.flatMap(c =>
        c.players.map((p, i) => [p.playerId, c.numbers[i]] as [string, number])
    );

    const uniquePlayersNumbers = classificationsWithPlayers.flatMap(c => c.players.map);

    // const uidsNumbers = new Map<string, number>(playersNumbers);

    // playersNumbers.forEach(element => {
    //     uidsNumbers;
    // });

    // const playersInClassifications = playersByClassifications.map(p => p.length).reduce((r, l) => r + l, 0);

    // if (playersInClassifications !== paidPlayers.length) throw new Error("We got the same players in");

    // const gcPlayers = paidPlayers.filter(p => p.Klasyfikacja === "GC");
    // const nonGcPlayers = paidPlayers.filter(p => p.Klasyfikacja !== "GC");
    // const proPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK PRO");
    // const funPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK FUN");
    // const ttPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK TT");

    // if (gcPlayers.filter(gp => nonGcPlayers.find(ngc => gp["playerId"] === ngc["playerId"])).length)
    //     throw new Error("The same player paid in GC and any other classification");

    // if (proPlayers.filter(pp => funPlayers.find(fp => pp["playerId"] === fp["playerId"])).length)
    //     throw new Error("The same player paid in PRO and FUN classification");

    // if (proPlayers.filter(pp => ttPlayers.find(tp => pp["playerId"] === tp["playerId"])).length)
    //     throw new Error("The same player paid in PRO and TT classification separately");

    // const playerUids = new Set<string>(paidPlayers.map(p => p["uid"]));

    // gcPlayers.forEach((p, i) => {
    //     uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
    // });

    // potentialNumbers = potentialNumbers.slice(10);

    // proPlayers.forEach((p, i) => {
    //     uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
    // });

    // potentialNumbers = potentialNumbers.slice(10);

    // funPlayers.forEach((p, i) => {
    //     uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
    // });

    // potentialNumbers = potentialNumbers.slice(10);

    // ttPlayers.forEach((p, i) => {
    //     uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
    // });

    // if (playerUids.size !== uidsNumbers.size) throw new Error("Not all players got numbers");

    return { type: "Success", playersNumbers };

    // return paidPlayers.map(p => ({
    //     ...p,
    //     ["Nr zawodnika"]: uidsNumbers.get(p["uid"])
    // }));
};
