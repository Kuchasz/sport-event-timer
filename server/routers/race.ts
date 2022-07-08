import * as trpc from "@trpc/server";
import { db } from "../db";
import { z } from "zod";

export const raceRouter = trpc
    .router()
    .query("races", {
        async resolve() {
            return await db.race.findMany();
        }
    })
    .mutation("add", {
        input: z.object({
            name: z.string({ required_error: "name is required" }).min(5, "name must be at least 5 characters")
        }),
        async resolve(req) {
            return await db.race.create({ data: { name: req.input.name } });
        }
    });

export type RaceRouter = typeof raceRouter;
