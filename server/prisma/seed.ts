import { faker } from "@faker-js/faker";
import { db } from "../db";
import { createRange } from "@set/shared/dist/index";
import { Classification, Player } from "@prisma/client";

async function main() {
    const adminUser = await db.user.findFirst({ where: { id: 1 } });

    if (adminUser)
        return;

    const user = await db.user.create({
        data: {
            login: 'admin',
            password: 'admin',
            id: 1
        }
    });

    const _races = createRange({ from: 0, to: faker.mersenne.rand(20, 10) }).map(() => ({
        date: faker.date.future(1),
        name: faker.company.name()
    }));

    const races = await db.$transaction(_races.map(data => db.race.create({ data })));

    const _classifications = createClassifications(races.map(r => r.id));

    const classifications = await db.$transaction(_classifications.map(data => db.classification.create({ data })));

    const _players = createPlayers(Object.fromEntries(races.map(r => [r.id, {}])), ['male', 'female'], user.id, classifications);

    const players = await db.$transaction(_players.map(data => db.player.create({ data })));
}

const createClassifications = (raceIds: number[]): Omit<Classification, "id">[] =>
    raceIds.flatMap(r =>
        createRange({ from: 0, to: faker.mersenne.rand(3, 2) })
            .map(c => ({
                raceId: r,
                name: faker.commerce.productName()
            })))

const createPlayers = (stores: { [key: number]: {} }, genders: string[], userId: number, classifications: Classification[]): Omit<Player, "id">[] =>
    classifications.flatMap(c => {
        return createRange({ from: 0, to: faker.mersenne.rand(200, 20) })
            .map(() => ({
                name: faker.name.firstName(),
                lastName: faker.name.lastName(),
                gender: faker.helpers.arrayElement(genders),
                birthDate: faker.date.birthdate({ min: 18, max: 99, mode: 'age' }),
                registeredByUserId: userId,
                bibNumber: faker.unique(faker.mersenne.rand, [400, 1], { store: stores[c.raceId] }),
                city: faker.address.cityName(),
                classificationId: c.id,
                raceId: c.raceId,
                country: faker.address.country(),
                email: faker.internet.email(),
                icePhoneNumber: faker.phone.number("###-###-###"),
                phoneNumber: faker.phone.number("###-###-###"),
                startTime: faker.datatype.datetime({ min: 0, max: 24 * 60 * 60 * 1000 }).getTime(),
                team: faker.company.name()
            }))
    }
    );

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })