import { db } from "../db";

async function main() {
    db.user.upsert({
        where: {
            id: 0
        },
        update: {},
        create: {
            login: 'admin',
            password: 'admin',
            id: 0
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