import { faker } from "@faker-js/faker/locale/pl";
import { db } from "../db";
import { createRange } from "@set/utils/dist/array";
import { capitalizeFirstLetter } from "@set/utils/dist/string"
import { Classification, Player, Race, TimingPoint, TimingPointOrder, BibNumber } from "@prisma/client";

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

    const _timingPointsOrders = createTimingPointsOrders(races.map(r => r.id), timingPoints);
    const timingPointsOrders = await db.$transaction(_timingPointsOrders.map(data => db.timingPointOrder.create({ data })));

    const _bibNumbers = createBibNumbers(races.map(r => r.id), players);
    await db.$transaction(_bibNumbers.map(data => db.bibNumber.create({ data })));

    const _stopwatches = createStopwatches(races, players, timingPoints, timingPointsOrders);
    await db.$transaction(_stopwatches.map(data => db.stopwatch.create({ data })));
}

const createRaces = (): Omit<Race, "id">[] => createRange({ from: 0, to: faker.mersenne.rand(20, 10) }).map(() => ({
    date: faker.date.future(1),
    name: faker.company.name(),
    registrationEnabled: false,
    playersLimit: faker.datatype.number({ min: 100, max: 1000, precision: 0 })
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
                    bibNumber: faker.helpers.unique(faker.mersenne.rand, [999, 1], { store: stores[c.raceId] }).toString(),
                    city: faker.address.cityName(),
                    classificationId: c.id,
                    raceId: c.raceId,
                    country: faker.address.country(),
                    email: faker.internet.email(),
                    icePhoneNumber: faker.phone.number("###-###-###"),
                    phoneNumber: faker.phone.number("###-###-###"),
                    startTime: Math.floor(faker.datatype.datetime({ min: 0, max: 24 * 60 * 60 * 1000 }).getTime() / 1000) * 1000,
                    team: faker.company.name(),
                    playerRegistrationId: null
                })
            })
    }
    );

const createTimingPoints = (raceIds: number[]): Omit<TimingPoint, "id">[] =>
    raceIds.flatMap(r => [
        { name: 'Start', description: 'Where the players start', raceId: r },
        ...createRange({ from: 0, to: faker.mersenne.rand(2, 0) })
            .map(() => ({ name: capitalizeFirstLetter(faker.word.noun()), description: faker.lorem.sentence(), raceId: r })),
        { name: 'Finish', description: 'Where the players ends', raceId: r }]);

const createTimingPointsOrders = (raceIds: number[], timingPoints: TimingPoint[]): TimingPointOrder[] =>
    raceIds.map(raceId => ({
        raceId,
        order: JSON.stringify(timingPoints.filter(tp => tp.raceId === raceId).map(tp => tp.id))
    }));

const createBibNumbers = (raceIds: number[], players: Player[]): BibNumber[] =>
    raceIds.flatMap(raceId => (
        players.filter(p => p.raceId === raceId).map(p => ({
            number: p.bibNumber,
            raceId
        }) as BibNumber)
    ));

const createStopwatches = (races: Race[], players: Player[], timingPoints: TimingPoint[], timingPointsOrders: TimingPointOrder[]) => {
    const store = {};
    return races.map(r => {
        const playersForRace = players.filter(p => p.raceId === r.id);
        const timingPointsOrder = JSON.parse(timingPointsOrders.find(tpo => tpo.raceId === r.id)!.order) as number[];

        const timingPointsForRace = timingPointsOrder.map(timingPointId => timingPoints.find(tp => tp.raceId === r.id && tp.id === timingPointId)!);

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