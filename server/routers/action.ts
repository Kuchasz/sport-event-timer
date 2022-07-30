import * as trpc from "@trpc/server";
import { createStore } from "@set/timer/dist/store";
import { fileExistsAsync, readJsonAsync, writeJson } from "../async-fs";
import { staticTimeKeppers } from "@set/timer/dist/slices/time-keepers";
import { TimerState } from "@set/timer/dist/store";
import { z } from "zod";

type Action = any;

const dispatchActionSchema = z.object({
    clientId: z.string(),
    action: z.any()
});

export const store = createStore([]);

const loadState = async () => {
    const statePath = "../state.json";
    const stateFileExists = await fileExistsAsync(statePath);

    const state = stateFileExists
        ? await readJsonAsync(statePath)
        : {
              players: [],
              timeKeepers: staticTimeKeppers,
              timeStamps: [],
              raceCategories: []
          };

    store.dispatch({
        type: "REPLACE_STATE",
        state
    });
};

loadState();

type Client = {
    emit: trpc.SubscriptionEmit<Action>;
    clientId: string;
};

let clients: Client[] = [];

export const dispatchAction = (payload: z.infer<typeof dispatchActionSchema>) => {
    clients.filter(c => c.clientId !== payload.clientId).forEach(c => c.emit.data(payload.action));
    store.dispatch(payload.action);
    writeJson(store.getState(), "../state.json");
};

export const readState = () => store.getState() as TimerState;

export const actionRouter = trpc
    .router()
    .mutation("dispatch", {
        input: dispatchActionSchema,
        resolve({ input }) {
            dispatchAction(input);
            return "OK";
        }
    })
    .query("state", {
        resolve() {
            return store.getState();
        }
    })
    .subscription("action-dispatched", {
        input: z.object({
            clientId: z.string()
        }),
        resolve({ input }) {
            return new trpc.Subscription<Action>(emit => {
                const { clientId } = input;

                clients = [...clients, { clientId, emit }];

                return () => {
                    clients = clients.filter(c => c.clientId !== clientId);
                };
            });
        }
    });

export type ActionRouter = typeof actionRouter;
