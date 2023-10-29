import { createRange, fillArray, groupBy } from "@set/utils/dist/array";
import { capitalizeFirstLetter } from "@set/utils/dist/string";
import { sportKinds } from "@set/utils/dist/sport-kind";

import type {
    Classification,
    Player,
    Race,
    TimingPoint,
    TimingPointOrder,
    BibNumber,
    PlayerProfile,
    PlayerRegistration,
    Category,
} from "@prisma/client";
import { db } from "./db";
import { faker } from "@faker-js/faker/locale/pl";
import type { TimerState } from "@set/timer/dist/store";
import { daysFromNow, stripSeconds } from "@set/utils/dist/datetime";

type Options = {
    name?: string;
    description?: string;
    location?: string;
    date?: Date;
    registrationEnabled?: boolean;
    termsUrl?: string | null;
    emailTemplate?: string | null;
    playersLimit?: number | null;
};

export const createExampleRaces = async (userId: string, numberOfRaces: number, options?: Options) => {
    const _races = createRaces(numberOfRaces, options);
    const races = await db.$transaction(_races.map(data => db.race.create({ data })));

    const _classifications = createClassifications(races.map(r => r.id));
    const classifications = await db.$transaction(_classifications.map(data => db.classification.create({ data })));

    const _categories = createCategories(classifications, ["male", "female"]);
    await db.$transaction(_categories.map(data => db.category.create({ data })));

    const _playerProfiles = createPlayerProfiles(
        races.map(r => r.id),
        ["male", "female"],
        options?.playersLimit,
    );
    const playerProfiles = await db.$transaction(_playerProfiles.map(data => db.playerProfile.create({ data })));

    const _playerRegistrations = createPlayerRegistrations(playerProfiles);
    const playerRegistrations = await db.$transaction(_playerRegistrations.map(data => db.playerRegistration.create({ data })));

    const classificationsByRace = groupBy(classifications, c => c.raceId);

    const _players = createPlayers(playerRegistrations, userId, classificationsByRace);
    const players = await db.$transaction(_players.map(data => db.player.create({ data })));

    const _timingPoints = createTimingPoints(races.map(r => r.id));
    const timingPoints = await db.$transaction(_timingPoints.map(data => db.timingPoint.create({ data })));

    const _timingPointsAccessUrls = createTimingPointsAccessUrls(timingPoints);
    await db.$transaction(_timingPointsAccessUrls.map(data => db.timingPointAccessUrl.create({ data })));

    const _timingPointsOrders = createTimingPointsOrders(
        races.map(r => r.id),
        timingPoints,
    );
    const timingPointsOrders = await db.$transaction(_timingPointsOrders.map(data => db.timingPointOrder.create({ data })));

    const _bibNumbers = createBibNumbers(
        races.map(r => r.id),
        players,
    );
    await db.$transaction(_bibNumbers.map(data => db.bibNumber.create({ data })));

    const _stopwatches = createStopwatches(races, players, timingPoints, timingPointsOrders);
    await db.$transaction(_stopwatches.map(data => db.stopwatch.create({ data })));
};

const createRaces = (numberOfRaces: number, options?: Options): Omit<Race, "id">[] =>
    fillArray(numberOfRaces).map(() => ({
        date: stripSeconds(faker.date.future({ years: 1 })),
        name: faker.company.name(),
        description: faker.lorem.words({ min: 5, max: 15 }),
        sportKind: faker.helpers.arrayElement(sportKinds),
        location: faker.location.city(),
        registrationEnabled: false,
        termsUrl: "",
        emailTemplate: "",
        playersLimit: faker.number.int({ min: 100, max: 1000 }),
        ...options,
    }));

const createClassifications = (raceIds: number[]): Omit<Classification, "id">[] =>
    raceIds.flatMap(r =>
        createRange({ from: 0, to: faker.number.int({ min: 2, max: 3 }) }).map(() => ({
            raceId: r,
            name: faker.commerce.productName(),
        })),
    );

const createCategories = (classifications: Classification[], genders: ("male" | "female")[]): Omit<Category, "id">[] =>
    classifications.flatMap(c =>
        createRange({ from: 0, to: faker.number.int({ min: 2, max: 3 }) }).map(() => {
            const isSpecial = faker.datatype.boolean();

            const gender = faker.helpers.arrayElement(genders);
            const minAge = faker.number.int({ min: 18, max: 99 });

            return {
                name: faker.commerce.productName(),
                classificationId: c.id,
                isSpecial,
                minAge,
                maxAge: minAge + 10,
                gender,
            };
        }),
    );

const createPlayerProfiles = (races: number[], genders: ("male" | "female")[], playersLimit?: number | null): Omit<PlayerProfile, "id">[] =>
    races.flatMap(raceId => {
        return createRange({ from: 0, to: faker.number.int({ min: 20, max: playersLimit ?? 200 }) }).map(() => {
            const gender = faker.helpers.arrayElement(genders);
            return {
                name: faker.person.firstName(gender),
                lastName: faker.person.lastName(gender),
                gender,
                birthDate: faker.date.birthdate({ min: 18, max: 99, mode: "age" }),
                city: faker.location.city(),
                raceId: raceId,
                country: faker.location.countryCode(),
                email: faker.internet.email(),
                icePhoneNumber: faker.phone.number("###-###-###"),
                phoneNumber: faker.phone.number("###-###-###"),
                team: faker.company.name(),
            };
        });
    });

const createPlayerRegistrations = (playerProfiles: PlayerProfile[]): Omit<PlayerRegistration, "id">[] =>
    playerProfiles.map(pp => {
        const hasPaid = faker.datatype.boolean();
        return {
            raceId: pp.raceId,
            registrationDate: faker.date.past({ years: 1 }),
            hasPaid,
            paymentDate: hasPaid ? faker.date.past({ years: 1 }) : null,
            playerProfileId: pp.id,
        };
    });

const createPlayers = (
    playerRegistrations: PlayerRegistration[],
    userId: string,
    classifications: Record<number, Classification[]>,
): Omit<Player, "id">[] => {
    const bibNumbers = createRange({ from: 1, to: 999 });

    return playerRegistrations
        .filter(pr => pr.hasPaid)
        .map(pr => ({
            registeredByUserId: userId,
            bibNumber: bibNumbers.splice(faker.number.int({ min: 0, max: bibNumbers.length }), 1)[0].toString(),
            classificationId: faker.helpers.arrayElement(classifications[pr.raceId]).id,
            raceId: pr.raceId,
            startTime: Math.floor(faker.date.between({ from: 0, to: 24 * 60 * 60 * 1000 }).getTime() / 1000) * 1000,
            playerRegistrationId: pr.id,
            playerProfileId: pr.playerProfileId,
        }));
};

const createTimingPoints = (raceIds: number[]): Omit<TimingPoint, "id">[] =>
    raceIds.flatMap(r => [
        { name: "Start", shortName: "S", description: "Where the players start", raceId: r },
        ...createRange({ from: 0, to: faker.number.int({ min: 0, max: 2 }) }).map(() => ({
            name: capitalizeFirstLetter(faker.word.noun()),
            shortName: faker.helpers.fromRegExp(/[A-Z][0-9]/),
            description: faker.lorem.sentence(),
            raceId: r,
        })),
        { name: "Finish", shortName: "M", description: "Where the players ends", raceId: r },
    ]);

const createTimingPointsAccessUrls = (timingPoints: TimingPoint[]) =>
    timingPoints.map(tp => ({
        canAccessOthers: false,
        expireDate: daysFromNow(5),
        token: "blah",
        code: "",
        raceId: tp.raceId,
        timingPointId: tp.id,
        name: "",
    }));

const createTimingPointsOrders = (raceIds: number[], timingPoints: TimingPoint[]): TimingPointOrder[] =>
    raceIds.map(raceId => ({
        raceId,
        order: JSON.stringify(timingPoints.filter(tp => tp.raceId === raceId).map(tp => tp.id)),
    }));

const createBibNumbers = (raceIds: number[], players: Player[]): BibNumber[] =>
    raceIds.flatMap(raceId =>
        players
            .filter(p => p.raceId === raceId)
            .map(
                p =>
                    ({
                        number: p.bibNumber,
                        raceId,
                    }) as BibNumber,
            ),
    );

const createStopwatches = (races: Race[], players: Player[], timingPoints: TimingPoint[], timingPointsOrders: TimingPointOrder[]) => {
    return races.map(r => {
        const playersForRace = players.filter(p => p.raceId === r.id);
        const timingPointsOrder = JSON.parse(timingPointsOrders.find(tpo => tpo.raceId === r.id)!.order) as number[];

        const timingPointsForRace = timingPointsOrder.map(
            timingPointId => timingPoints.find(tp => tp.raceId === r.id && tp.id === timingPointId)!,
        );

        const chosenPlayersNumber = faker.number.int({ min: 0, max: playersForRace.length });

        const startTimeDate = faker.date.between({ from: r.date, to: new Date(r.date.getTime() + 3_600_000) });

        const ids = createRange({ from: 1, to: 9999 });

        const timeStamps = createRange({ from: 0, to: chosenPlayersNumber })
            .map(i => playersForRace[i])
            .flatMap(p =>
                timingPointsForRace.map((tp, i) => ({
                    id: ids.splice(faker.number.int({ min: 1, max: ids.length }), 1)[0],
                    bibNumber: Number(p.bibNumber!),
                    timingPointId: tp.id,
                    time: faker.date
                        .between({
                            from: new Date(startTimeDate.getTime() + i * 3_600_000),
                            to: new Date(startTimeDate.getTime() + i * 3_600_600 + 3_600_600),
                        })
                        .getTime(),
                })),
            );

        const state = { timeStamps, actionsHistory: [], absences: [] } as TimerState;

        return { raceId: r.id, state: JSON.stringify(state) };
    });
};
