import { PrismaClient } from "@prisma/client";
import type { TimerState } from "@set/timer/dist/store";
import { createStore } from "@set/timer/dist/store";

export const db = new PrismaClient();

const defaultState = createStore([]).getState();

export const stopwatchStateProvider = {
    get: (raceId: number) =>
        db.stopwatch
            .findUnique({ where: { raceId }, select: { state: true } })
            .then(result => (result?.state ? (JSON.parse(result.state) as Partial<TimerState>) : (defaultState as Partial<TimerState>))),
    save: (raceId: number, state?: TimerState) =>
        db.stopwatch.upsert({
            create: { raceId, state: state ? JSON.stringify(state) : JSON.stringify(defaultState) },
            update: { state: state ? JSON.stringify(state) : JSON.stringify(defaultState) },
            where: { raceId },
        }),
};
