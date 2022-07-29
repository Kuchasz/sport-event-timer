import * as trpc from "@trpc/server";
import { date, z } from "zod";
import { EventEmitter } from "events";

export const ntpRouter = trpc.router().mutation("sync", {
    input: z.number(),
    output: z.number(),
    resolve() {
        return Date.now();
    }
});

export type NTPRouter = typeof ntpRouter;
