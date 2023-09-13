import { createRange, groupBy } from "@set/utils/dist/array";
import { capitalizeFirstLetter } from "@set/utils/dist/string"
import { Classification, Player, Race, TimingPoint, TimingPointOrder, BibNumber, PlayerProfile, PlayerRegistration } from "@prisma/client";
import { db } from "./db";
import { faker } from "@faker-js/faker/locale/pl";

export const createExampleRaces = async (userId: string, numberOfRaces: number) => {
    const _races = createRaces(numberOfRaces);
    const races = await db.$transaction(_races.map(data => db.race.create({ data })));

    const _classifications = createClassifications(races.map(r => r.id));
    const classifications = await db.$transaction(_classifications.map(data => db.classification.create({ data })));

    const _playerProfiles = createPlayerProfiles(races.map(r => r.id), ['male', 'female']);
    const playerProfiles = await db.$transaction(_playerProfiles.map(data => db.playerProfile.create({ data })));

    const _playerRegistrations = createPlayerRegistrations(playerProfiles);
    const playerRegistrations = await db.$transaction(_playerRegistrations.map(data => db.playerRegistration.create({ data })));

    const classificationsByRace = groupBy(classifications, c => c.raceId);

    const _players = createPlayers(playerRegistrations, userId, classificationsByRace);
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


const createRaces = (numberOfRaces: number): Omit<Race, "id">[] => createRange({ from: 0, to: numberOfRaces }).map(() => ({
    date: faker.date.future(1),
    name: faker.company.name(),
    registrationEnabled: false,
    termsUrl: '',
    emailTemplate: '',
    playersLimit: faker.number.int({ min: 100, max: 1000 })
}));

const createClassifications = (raceIds: number[]): Omit<Classification, "id">[] =>
    raceIds.flatMap(r =>
        createRange({ from: 0, to: faker.number.int({ min: 2, max: 3 }) })
            .map(() => ({
                raceId: r,
                name: faker.commerce.productName()
            })))

const createPlayerProfiles = (races: number[], genders: ('male' | 'female')[]): Omit<PlayerProfile, "id">[] =>
    races.flatMap(raceId => {
        return createRange({ from: 0, to: faker.number.int({ min: 20, max: 200 }) })
            .map(() => {
                const gender = faker.helpers.arrayElement(genders);
                return ({
                    name: faker.person.firstName(gender),
                    lastName: faker.person.lastName(gender),
                    gender,
                    birthDate: faker.date.birthdate({ min: 18, max: 99, mode: 'age' }),
                    city: faker.location.city(),
                    raceId: raceId,
                    country: faker.location.countryCode(),
                    email: faker.internet.email(),
                    icePhoneNumber: faker.phone.number("###-###-###"),
                    phoneNumber: faker.phone.number("###-###-###"),
                    team: faker.company.name(),
                })
            })
    }
    );

const createPlayerRegistrations = (playerProfiles: PlayerProfile[]): Omit<PlayerRegistration, "id">[] =>
    playerProfiles.map((pp) => {
        const hasPaid = faker.datatype.boolean();
        return ({
            raceId: pp.raceId,
            registrationDate: faker.date.past(1),
            hasPaid,
            paymentDate: hasPaid ? faker.date.past(1) : null,
            playerProfileId: pp.id
        })
    });

const createPlayers = (
    playerRegistrations: PlayerRegistration[],
    userId: string,
    classifications: { [raceId: number]: Classification[] }): Omit<Player, "id">[] => {
    const bibNumbers = createRange({ from: 1, to: 999 });
    return playerRegistrations
        .filter(pr => pr.hasPaid)
        .map((pr) => {
            return ({
                registeredByUserId: userId,
                bibNumber: bibNumbers.splice(faker.number.int({ min: 1, max: bibNumbers.length }), 1)[0].toString(),
                classificationId: faker.helpers.arrayElement(classifications[pr.raceId]).id,
                raceId: pr.raceId,
                startTime: Math.floor(faker.date.between({ from: 0, to: 24 * 60 * 60 * 1000 }).getTime() / 1000) * 1000,
                playerRegistrationId: pr.id,
                playerProfileId: pr.playerProfileId
            })
        }
        );
}

const createTimingPoints = (raceIds: number[]): Omit<TimingPoint, "id">[] =>
    raceIds.flatMap(r => [
        { name: 'Start', description: 'Where the players start', raceId: r },
        ...createRange({ from: 0, to: faker.number.int({ min: 0, max: 2 }) })
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
    return races.map(r => {
        const playersForRace = players.filter(p => p.raceId === r.id);
        const timingPointsOrder = JSON.parse(timingPointsOrders.find(tpo => tpo.raceId === r.id)!.order) as number[];

        const timingPointsForRace = timingPointsOrder.map(timingPointId => timingPoints.find(tp => tp.raceId === r.id && tp.id === timingPointId)!);

        const chosenPlayersNumber = faker.number.int({ min: 0, max: playersForRace.length });

        const startTimeDate = faker.date.between({ from: r.date, to: new Date(r.date.getTime() + 3_600_000) });

        const ids = createRange({ from: 1, to: 9999 });

        const timeStamps = createRange({ from: 0, to: chosenPlayersNumber })
            .map(i => playersForRace[i])
            .flatMap(p => timingPointsForRace.map((tp, i) => ({
                id: ids.splice(faker.number.int({ min: 1, max: ids.length }), 1)[0],
                bibNumber: p.bibNumber!,
                timingPointId: tp.id,
                time: faker.date.between({
                    from: new Date(startTimeDate.getTime() + i * 3_600_000),
                    to: new Date(startTimeDate.getTime() + i * 3_600_600 + 3_600_600)
                }).getTime()
            })));

        return { raceId: r.id, state: JSON.stringify({ timeStamps, actionsHistory: [] }) };
    });
}
