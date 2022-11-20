import { faker } from "@faker-js/faker/locale/pl";
import { db } from "../db";
import { createRange, sort } from "@set/utils/dist/array";
import { capitalizeFirstLetter } from "@set/utils/dist/string"
import { Classification, Player, Race, TimingPoint } from "@prisma/client";

async function main() {
    const userId = 'cla34zyas000852dulvt5oua7';
    const adminUser = await db.user.create({ data: { id: userId, name: 'Admin', email: 'admin', emailVerified: new Date() } });

    const _races = createRaces();
    const races = await db.$transaction(_races.map(data => db.race.create({ data })));

    const _classifications = createClassifications(races.map(r => r.id));
    const classifications = await db.$transaction(_classifications.map(data => db.classification.create({ data })));

    const _players = createPlayers(Object.fromEntries(races.map(r => [r.id, {}])), ['male', 'female'], adminUser.id, classifications);
    const players = await db.$transaction(_players.map(data => db.player.create({ data })));

    const _timingPoints = createTimingPoints(races.map(r => r.id));
    const timingPoints = await db.$transaction(_timingPoints.map(data => db.timingPoint.create({ data })));

    const _stopwatches = createStopwatches(races, players, timingPoints);
    await db.$transaction(_stopwatches.map(data => db.stopwatch.create({ data })));
}

const createRaces = (): Omit<Race, "id">[] => createRange({ from: 0, to: faker.mersenne.rand(20, 10) }).map(() => ({
    date: faker.date.future(1),
    name: faker.company.name()
}));

const createClassifications = (raceIds: number[]): Omit<Classification, "id">[] =>
    raceIds.flatMap(r =>
        createRange({ from: 0, to: faker.mersenne.rand(3, 2) })
            .map(() => ({
                raceId: r,
                name: faker.commerce.productName()
            })))

const createPlayers = (stores: { [key: number]: {} }, genders: ('male' | 'female')[], userId: string, classifications: Classification[]): Omit<Player, "id">[] =>
    classifications.flatMap(c => {
        return createRange({ from: 0, to: faker.mersenne.rand(200, 20) })
            .map(() => {
                const gender = faker.helpers.arrayElement(genders);
                return ({
                    name: faker.name.firstName(gender),
                    lastName: faker.name.lastName(gender),
                    gender,
                    birthDate: faker.date.birthdate({ min: 18, max: 99, mode: 'age' }),
                    registeredByUserId: userId,
                    bibNumber: faker.helpers.unique(faker.mersenne.rand, [999, 1], { store: stores[c.raceId] }),
                    city: faker.address.cityName(),
                    classificationId: c.id,
                    raceId: c.raceId,
                    country: faker.address.country(),
                    email: faker.internet.email(),
                    icePhoneNumber: faker.phone.number("###-###-###"),
                    phoneNumber: faker.phone.number("###-###-###"),
                    startTime: faker.datatype.datetime({ min: 0, max: 24 * 60 * 60 * 1000 }).getTime(),
                    team: faker.company.name()
                })
            })
    }
    );

const createTimingPoints = (raceIds: number[]): Omit<TimingPoint, "id">[] =>
    raceIds.flatMap(r => [
        { name: 'Start', order: 1, raceId: r },
        ...createRange({ from: 0, to: faker.mersenne.rand(2, 0) })
            .map((i) => ({ name: capitalizeFirstLetter(faker.word.noun()), order: 2 + i, raceId: r })),
        { name: 'Finish', order: 5, raceId: r }]);

const createStopwatches = (races: Race[], players: Player[], timingPoints: TimingPoint[]) => {
    const store = {};
    return races.map(r => {
        const playersForRace = players.filter(p => p.raceId === r.id);
        const timingPointsForRace = sort(timingPoints.filter(tp => tp.raceId === r.id), r => r.order);

        const chosenPlayersNumber = faker.mersenne.rand(playersForRace.length, 0);

        const startTimeDate = faker.date.between(r.date, new Date(r.date.getTime() + 3_600_000));

        const timeStamps = createRange({ from: 0, to: chosenPlayersNumber })
            .map(i => playersForRace[i])
            .flatMap(p => timingPointsForRace.map((tp, i) => ({
                id: faker.helpers.unique(faker.mersenne.rand, [1, 9999], store),
                bibNumber: p.bibNumber!,
                timingPointId: tp.id,
                time: faker.date.between(new Date(startTimeDate.getTime() + i * 3_600_000), new Date(startTimeDate.getTime() + i * 3_600_600 + 3_600_600)).getTime()
            })));

        return { raceId: r.id, state: JSON.stringify({ timeStamps, actionsHistory: [] }) };
    });
}

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })