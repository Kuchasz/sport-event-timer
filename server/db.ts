import { PrismaClient } from "@prisma/client";
import { createStore, TimerState } from "@set/timer/dist/store";

export const db = new PrismaClient();

const defaultState = createStore([]).getState();

export const stopwatchStateProvider = {
    get: (raceId: number) => db
        .stopwatch
        .findUnique({ where: { raceId }, select: { state: true } })
        .then(result => result?.state ? JSON.parse(result.state) as Partial<TimerState> : defaultState as Partial<TimerState>),
    save: (raceId: number, state: TimerState) => db
        .stopwatch
        .upsert({ 
            create: { raceId, state: JSON.stringify(state) },
            update: { state: JSON.stringify(state) },
            where: { raceId }
        })
};