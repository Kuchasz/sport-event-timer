import * as trpc from "@trpc/server";
import { EventEmitter } from "events";
import { z } from "zod";

type Action = any;
const ee = new EventEmitter();

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
    .subscription("onDispatched", {
        resolve() {
            return new trpc.Subscription<Action>(emit => {
                const onDispatched = (action: Action) => {
                    emit.data(action);
                };

                ee.on("dispatch", onDispatched);

                return () => {
                    ee.off("dispatch", onDispatched);
                };
            });
        }
    });

export type ActionRouter = typeof actionRouter;
