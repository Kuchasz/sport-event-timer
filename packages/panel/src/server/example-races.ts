import { fakerEN, fakerPL, type Faker } from "@faker-js/faker";
import type {
    BibNumber,
    Category,
    Classification,
    Player,
    PlayerProfile,
    PlayerRegistration,
    Race,
    Split,
    SplitOrder,
    TimingPoint,
} from "@prisma/client";
import type { TimerState } from "@set/timer/dist/store";
import { createRange, fillArray, groupBy, toMap } from "@set/utils/dist/array";
import { addMinutesToDate, daysFromNow, getEpochDate, stripTime, subtractDaysFromDate } from "@set/utils/dist/datetime";
import { sportKinds } from "@set/utils/dist/sport-kind";
import { capitalizeFirstLetter } from "@set/utils/dist/string";
import type { Locales } from "../i18n/locales";
import { db } from "./db";
import { updateSplitTimesQueue } from "./queue";

type FakerLocales = Record<Locales, Faker>;

const fakerLocales: FakerLocales = {
    pl: fakerPL,
    en: fakerEN,
};

type Options = {
    name?: string;
    description?: string;
    location?: string;
    date?: Date;
    registrationEnabled?: boolean;
    termsUrl?: string | null;
    websiteUrl?: string | null;
    emailTemplate?: string | null;
    playersLimit?: number | null;
};

export const createExampleRaces = async (userId: string, numberOfRaces: number, locale: Locales, options?: Options) => {
    const faker = fakerLocales[locale];

    const _races = createRaces(faker, numberOfRaces, options);
    const races = await db.$transaction(_races.map(data => db.race.create({ data })));

    const _classifications = createClassifications(
        faker,
        races.map(r => r.id),
    );
    const classifications = await db.$transaction(_classifications.map(data => db.classification.create({ data })));

    const _categories = createCategories(faker, classifications, ["male", "female"]);
    await db.$transaction(_categories.map(data => db.category.create({ data })));

    const _playerProfiles = createPlayerProfiles(
        faker,
        races.map(r => r.id),
        ["male", "female"],
        options?.playersLimit,
    );
    const playerProfiles = await db.$transaction(_playerProfiles.map(data => db.playerProfile.create({ data })));

    const _playerRegistrations = createPlayerRegistrations(faker, playerProfiles);
    const playerRegistrations = await db.$transaction(_playerRegistrations.map(data => db.playerRegistration.create({ data })));

    const classificationsByRace = groupBy(classifications, c => c.raceId);

    const _players = createPlayers(faker, playerRegistrations, userId, classificationsByRace);
    const players = await db.$transaction(_players.map(data => db.player.create({ data })));

    const _timingPoints = createTimingPoints(
        faker,
        races.map(r => r.id),
    );
    const timingPoints = await db.$transaction(_timingPoints.map(data => db.timingPoint.create({ data })));

    const _timingPointsAccessUrls = createTimingPointsAccessUrls(timingPoints);
    await db.$transaction(_timingPointsAccessUrls.map(data => db.timingPointAccessUrl.create({ data })));

    const _splits = createSplits(timingPoints, classifications);

    const splits = await db.$transaction(_splits.map(data => db.split.create({ data })));

    const _splitsOrders = createSplitsOrders(
        classifications.map(c => ({ raceId: c.raceId, classificationId: c.id })),
        splits,
    );

    const splitsOrders = await db.$transaction(_splitsOrders.map(data => db.splitOrder.create({ data })));

    const _bibNumbers = createBibNumbers(
        races.map(r => r.id),
        players,
    );
    await db.$transaction(_bibNumbers.map(data => db.bibNumber.create({ data })));

    const _stopwatches = createStopwatches(faker, races, players, classifications, splits, splitsOrders);

    await db.$transaction(_stopwatches.map(data => db.stopwatch.create({ data })));

    _stopwatches.forEach(async ({ raceId }) => {
        await updateSplitTimesQueue.push({ raceId });
    });
};

const createRaces = (faker: Faker, numberOfRaces: number, options?: Options): Omit<Race, "id">[] =>
    fillArray(numberOfRaces).map(() => {
        const raceDate = stripTime(faker.date.future({ years: 1 }));
        const registrationCutoff = subtractDaysFromDate(raceDate, faker.number.int({ min: 1, max: 7 }));
        return {
            date: raceDate,
            name: faker.company.name(),
            description: faker.lorem.words({ min: 5, max: 15 }),
            sportKind: faker.helpers.arrayElement(sportKinds),
            location: faker.location.city(),
            registrationEnabled: false,
            registrationCutoff: registrationCutoff,
            termsUrl: "",
            websiteUrl: "",
            emailTemplate: "",
            playersLimit: faker.number.int({ min: 100, max: 1000 }),
            ...options,
        };
    });

const createClassifications = (faker: Faker, raceIds: number[]): Omit<Classification, "id">[] =>
    raceIds.flatMap(r =>
        createRange({ from: 0, to: faker.number.int({ min: 2, max: 3 }) }).map(() => ({
            raceId: r,
            name: faker.commerce.productName(),
        })),
    );

const createCategories = (faker: Faker, classifications: Classification[], genders: ("male" | "female")[]): Omit<Category, "id">[] =>
    classifications.flatMap(c =>
        createRange({ from: 0, to: faker.number.int({ min: 2, max: 3 }) }).map(() => {
            const isSpecial = faker.datatype.boolean();

            const gender = faker.helpers.arrayElement(genders);
            const minAge = faker.number.int({ min: 18, max: 99 });
            const name = faker.commerce.productName();

            return {
                name,
                abbrev: faker.hacker.abbreviation(),
                classificationId: c.id,
                isSpecial,
                minAge,
                maxAge: minAge + 10,
                gender,
            };
        }),
    );

const createPlayerProfiles = (
    faker: Faker,
    races: number[],
    genders: ("male" | "female")[],
    playersLimit?: number | null,
): Omit<PlayerProfile, "id">[] =>
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

const createPlayerRegistrations = (faker: Faker, playerProfiles: PlayerProfile[]): Omit<PlayerRegistration, "id">[] =>
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
    faker: Faker,
    playerRegistrations: PlayerRegistration[],
    userId: string,
    classifications: Record<number, Classification[]>,
): Omit<Player, "id">[] => {
    const bibNumbers = createRange({ from: 1, to: 999 });
    const startTime = getEpochDate(9, 0, 0);

    return playerRegistrations
        .filter(pr => pr.hasPaid)
        .map((pr, index) => ({
            promotedByUserId: userId,
            bibNumber: bibNumbers.splice(faker.number.int({ min: 0, max: bibNumbers.length }), 1)[0].toString(),
            classificationId: faker.helpers.arrayElement(classifications[pr.raceId]).id,
            raceId: pr.raceId,
            startTime: addMinutesToDate(startTime, index).getTime(),
            playerRegistrationId: pr.id,
            playerProfileId: pr.playerProfileId,
        }));
};

const createTimingPoints = (faker: Faker, raceIds: number[]): Omit<TimingPoint, "id">[] =>
    raceIds.flatMap(r => [
        { name: "Start", type: "start", abbrev: "S", description: faker.lorem.sentence(), raceId: r },
        ...createRange({ from: 0, to: faker.number.int({ min: 0, max: 2 }) }).map(() => ({
            name: capitalizeFirstLetter(faker.word.noun()),
            type: "checkpoint",
            abbrev: faker.helpers.fromRegExp(/[A-Z][0-9]/),
            description: faker.lorem.sentence(),
            raceId: r,
        })),
        { name: "Finish", type: "finish", abbrev: "M", description: faker.lorem.sentence(), raceId: r },
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

const createSplits = (timingPoints: TimingPoint[], classifications: Classification[]): Omit<Split, "id">[] =>
    classifications.flatMap(c =>
        timingPoints.map(tp => ({
            name: tp.name,
            classificationId: c.id,
            raceId: c.raceId,
            timingPointId: tp.id,
        })),
    );

const createSplitsOrders = (ids: { raceId: number; classificationId: number }[], splits: Split[]): SplitOrder[] =>
    ids.map(id => ({
        raceId: id.raceId,
        classificationId: id.classificationId,
        order: JSON.stringify(splits.filter(s => s.raceId === id.raceId && s.classificationId === id.classificationId).map(s => s.id)),
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

const createStopwatches = (
    faker: Faker,
    races: Race[],
    players: Player[],
    classifications: Classification[],
    splits: Split[],
    splitsOrders: SplitOrder[],
) => {
    return races.map(r => {
        const playersForRace = players.filter(p => p.raceId === r.id);
        const classificationsForRace = classifications.filter(c => c.raceId === r.id);

        const splitsOrdersForRace = toMap(
            splitsOrders.filter(so => so.raceId === r.id),
            so => so.classificationId,
            so => JSON.parse(so.order) as number[],
        );

        const splitsForRace = toMap(
            classificationsForRace,
            c => c.id,
            c => splitsOrdersForRace[c.id].map(splitId => splits.find(s => s.raceId === r.id && s.id === splitId)!),
        );

        const chosenPlayersNumber = faker.number.int({ min: 0.66 * playersForRace.length, max: playersForRace.length });

        const startTimeDate = faker.date.between({ from: r.date, to: new Date(r.date.getTime() + 3_600_000) });

        const ids = createRange({ from: 1, to: 9999 });

        const splitTimes = createRange({ from: 0, to: chosenPlayersNumber })
            .map(i => playersForRace[i])
            .flatMap(p =>
                splitsForRace[p.classificationId].map((s, i) => ({
                    id: ids.splice(faker.number.int({ min: 1, max: ids.length }), 1)[0],
                    bibNumber: Number(p.bibNumber),
                    splitId: s.id,
                    timingPointId: s.timingPointId,
                    time: faker.date
                        .between({
                            from: new Date(startTimeDate.getTime() + i * 3_600_000),
                            to: new Date(startTimeDate.getTime() + i * 3_600_600 + 3_600_600),
                        })
                        .getTime(),
                })),
            );

        const state = { splitTimes, actionsHistory: [], absences: [] } as TimerState;

        return { raceId: r.id, state: JSON.stringify(state) };
    });
};
