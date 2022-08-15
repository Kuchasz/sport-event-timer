import * as trpc from "@trpc/server";
import { createStore } from "@set/timer/dist/store";
import { z } from "zod";
import { stopwatchStateProvider } from "../db";
import { updateSplitTimesQueue } from "../queue";

type Action = any;

const dispatchActionSchema = z.object({
    raceId: z.number(),
    clientId: z.string(),
    action: z.any()
});

type Client = {
    emit: trpc.SubscriptionEmit<Action>;
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

export const actionRouter = trpc
    .router()
    .mutation("dispatch", {
        input: dispatchActionSchema,
        async resolve({ input }) {
            await dispatchAction(input.raceId, input.clientId, input.action);
            return "OK";
        }
    })
    .query("state", {
        input: z.object({
            raceId: z.number()
        }),
        resolve({ input }) {
            return stopwatchStateProvider.get(input.raceId)
        }
    })
    .subscription("action-dispatched", {
        input: z.object({
            clientId: z.string(),
            raceId: z.number()
        }),
        resolve({ input }) {
            return new trpc.Subscription<Action>(emit => {
                const { clientId, raceId } = input;

                clients = [...clients, { clientId, raceId, emit }];

                return () => {
                    clients = clients.filter(c => c.clientId !== clientId);
                };
            });
        }
    });

export type ActionRouter = typeof actionRouter;
