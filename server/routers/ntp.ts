import * as trpc from "@trpc/server";
import { z } from "zod";

export const ntpRouter = trpc.router().mutation("sync", {
    input: z.number(),
    output: z.number(),
    resolve() {
        return Date.now();
    }
});

export type NTPRouter = typeof ntpRouter;
