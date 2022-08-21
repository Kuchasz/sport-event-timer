import { db } from "../db";

async function main() {
    await db.user.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            login: 'admin',
            password: 'admin',
            id: 1
        }
    })
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