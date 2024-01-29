import { areOverlapping, createRange } from "@set/utils/dist/array";

export type ClassificationConfig = {
    id: string;
    excludes: string[];
    range: { from: number; to: number };
};

type AssignmentResult<Id> = {
    type: "Success" | "Error";
    errorType?: "RangesOverlap" | "RangesExceeded" | "ExcludesViolated" | "DuplicatedPlayers";
    playersNumbers: [Id, number][];
};

export const assignNumbersToPlayers = <T, Id>(
    players: T[],
    forbiddenNumbers: number[],
    classifications: ClassificationConfig[],
    getPlayerId: (player: T) => Id,
    getClassificationId: (player: T) => string,
): AssignmentResult<Id> => {
    const uniqueNumbers = true;
    const rangesOverlapping = classifications.some(c => classifications.some(cc => c.id !== cc.id && areOverlapping(c.range, cc.range)));

    if (rangesOverlapping)
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "RangesOverlap",
        };

    const classificationsWithPlayers = classifications.map(c => ({
        ...c,
        numbers: createRange(c.range).filter(n => !forbiddenNumbers.includes(n)),
        players: players.filter(p => getClassificationId(p) === c.id).map(p => ({ ...p, playerId: getPlayerId(p) })),
    }));

    const playerDuplicatedInClassification = classificationsWithPlayers.some(
        c => c.players.length !== new Set(c.players.map(p => p.playerId)).size,
    );

    if (playerDuplicatedInClassification) {
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "DuplicatedPlayers",
        };
    }

    const notEnoughSlots = classificationsWithPlayers.some(c => c.numbers.length < c.players.length);

    if (notEnoughSlots)
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "RangesExceeded",
        };

    const exclusionsToCheck = classificationsWithPlayers.flatMap(c =>
        c.excludes.map(exclusionCandidate => ({
            setA: { name: c.id, players: c.players.map(p => p.playerId) },
            setB: {
                name: exclusionCandidate,
                players: classificationsWithPlayers.find(cc => cc.id === exclusionCandidate)!.players.map(p => p.playerId),
            },
        })),
    );

    const anyExclusionsViolated = exclusionsToCheck.some(e => e.setA.players.some(pa => e.setB.players.includes(pa)));

    if (anyExclusionsViolated)
        return {
            type: "Error",
            playersNumbers: [],
            errorType: "ExcludesViolated",
        };

    const playerUniqueInClassification = Object.fromEntries(
        classificationsWithPlayers.flatMap(c => c.players.map(p => [p.playerId, c.id] as [Id, string])).reverse(),
    );

    const classificationsWithDesiredPlayers = classificationsWithPlayers.map(c => ({
        ...c,
        players: uniqueNumbers ? c.players.filter(p => playerUniqueInClassification[p.playerId] === c.id) : c.players,
    }));

    const playersNumbers = classificationsWithDesiredPlayers.flatMap(c =>
        c.players.map((p, i) => [p.playerId, c.numbers[i]] as [Id, number]),
    );

    return { type: "Success", playersNumbers };
};
