import { PrismaClient } from "@prisma/client";
import type { TimerState } from "@set/timer/dist/store";
export const db = new PrismaClient(); //new PrismaClient({ log: ["error", "info", "query"] });

export const stopwatchStateProvider = {
    get: (raceId: number) => db
        .stopwatch
        .findUnique({ where: { raceId }, select: { state: true } })
        .then(result => result?.state ? JSON.parse(result.state) as Partial<TimerState> : {} as Partial<TimerState>),
    save: (raceId: number, state: TimerState) => db
        .stopwatch
        .upsert({ 
            create: { raceId, state: JSON.stringify(state) },
            update: { state: JSON.stringify(state) },
            where: { raceId }
        })
};