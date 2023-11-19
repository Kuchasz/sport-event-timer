// const users = [
//     {
//         email: "test@test.com",
//         password: "password",
//         name: "Jane Doe",
//     },
// ];

import { uuidv4 } from "@set/utils/dist/uuid";
import { db } from "../server/db";

// export const sessions: Record<string, { sessionId: string; email: string; valid: boolean }> = {};

export async function getSession(sessionId: string) {
    // console.log(sessions, sessionId);
    const session = await db.session.findUnique({ where: { id: sessionId }, include: { user: true } }); //sessions[sessionId];

    return session?.valid ? session : null;
}

export async function invalidateSession(sessionId: string) {
    // const session = sessions[sessionId];

    const session = await db.session.findUnique({ where: { id: sessionId } }); //sessions[sessionId];

    if (session) {
        await db.session.update({ where: { id: sessionId }, data: { valid: false } });
        // sessions[sessionId].valid = false;
    }

    return session;
}

export async function createSession(userId: string) {
    // const sessionId = String(Object.keys(sessions).length + 1);

    // id           String   @id @default(cuid())
    // sessionToken String   @unique
    // userId       String
    // expires      DateTime
    // user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    // valid        Boolean

    const session = await db.session.create({ data: { sessionToken: uuidv4(), userId, expires: new Date(), valid: true } });

    // const session = { sessionId, email, valid: true, name };

    // sessions[sessionId] = session;

    return session;
}

export async function getUser(email: string) {
    return db.user.findUnique({ where: { email } });
}
