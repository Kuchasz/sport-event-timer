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
    .mutation("update", {
        input: z.object({
            id: z.number().min(1),
            name: z.string({ required_error: "name is required" })
        }),
        async resolve(req) {
            const { id, ...data } = req.input;
            return await db.race.update({ where: { id }, data });
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
