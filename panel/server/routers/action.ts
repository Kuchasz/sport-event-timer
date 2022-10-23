import { createStore } from "@set/timer/dist/store";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { observable } from '@trpc/server/observable';
import { stopwatchStateProvider } from "../db";
import { updateSplitTimesQueue } from "../queue";

type Action = any;

const dispatchActionSchema = z.object({
    raceId: z.number(),
    clientId: z.string(),
    action: z.any()
});

type Client = {
    emit: any; //!! any here
    clientId: string;
    raceId: number;
};

let clients: Client[] = [];

export const dispatchAction = async (raceId: number, clientId: string, action: any) => {
    clients
        .filter(c => c.raceId === raceId && c.clientId !== clientId)
        .forEach(c => c.emit.data(action));

    const state = await stopwatchStateProvider.get(raceId);
    const store = createStore([], state);

    store.dispatch(action);

    await stopwatchStateProvider.save(raceId, store.getState());
    updateSplitTimesQueue.push({ raceId });
};

export const actionRouter =
    router({
        dispatch: protectedProcedure
            .input(dispatchActionSchema)
            .mutation(async ({ input }) => {
                await dispatchAction(input.raceId, input.clientId, input.action);
                return "OK";
            }),
        state: protectedProcedure
            .input(z.object({ raceId: z.number() }))
            .query(({ input }) => stopwatchStateProvider.get(input.raceId)),
        actionDispatched: protectedProcedure
            .input(z.object({ clientId: z.string(), raceId: z.number() }))
            .subscription(({ input }) => {
                return observable<Action>(emit => {
                    const { clientId, raceId } = input;
                    clients = [...clients, { clientId, raceId, emit }];
                    return () => {
                        clients = clients.filter(c => c.clientId !== clientId);
                    };
                });
            })
    });

export type ActionRouter = typeof actionRouter;
