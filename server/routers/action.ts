import * as trpc from "@trpc/server";
import { createStore } from "@set/timer/store";
import { EventEmitter } from "events";
import { readFile } from "fs";
import { resolve } from "path";
import { staticTimeKeppers } from "@set/timer/slices/time-keepers";
import { writeJsonAsync } from "../async-fs";
import { z } from "zod";

type Action = any;
const ee = new EventEmitter();

const store = createStore([]);

readFile(resolve("../state.json"), { encoding: "utf8", flag: "r" }, (err, res) => {
    let state;

    if (err) {
        state = {
            players: [],
            timeKeepers: staticTimeKeppers,
            timeStamps: [],
            raceCategories: []
        };
    } else {
        state = JSON.parse(res.toString());
    }

    store.dispatch({
        type: "REPLACE_STATE",
        state
    });

    writeJsonAsync(state, "../state.json");
});

export const actionRouter = trpc
    .router()
    .mutation("dispatch", {
        input: z.object({
            action: z.any()
        }),
        resolve({ input }) {
            console.log(input.action);
            ee.emit("dispatch", input.action);
            return "OK";
        }
    })
    .query("state", {
        resolve() {
            return store.getState();
        }
    })
    .subscription("action-dispatched", {
        resolve() {
            return new trpc.Subscription<Action>(emit => {
                const onDispatched = (action: Action) => {
                    console.log("emit", action?.type);
                    // emit.data(action);
                };

                ee.on("dispatch", onDispatched);

                return () => {
                    ee.off("dispatch", onDispatched);
                };
            });
        }
    });

export type ActionRouter = typeof actionRouter;
