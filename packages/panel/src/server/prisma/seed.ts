import { faker } from "@faker-js/faker/locale/pl";
import { createExampleRaces } from "../example-races";
import { db } from "../db";

function main() {
    const userId = faker.string.uuid();
    return createExampleRaces(userId, faker.number.int({ min: 10, max: 20 }), "en");
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
