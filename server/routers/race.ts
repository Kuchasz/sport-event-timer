import * as trpc from "@trpc/server";
import { db } from "../db";
import { z } from "zod";

const raceSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: "name is required" }),
    date: z.date({ required_error: "date is required" })
});

export const raceRouter = trpc
    .router()
    .query("races", {
        async resolve() {
            return await db.race.findMany();
        }
    })
    .mutation("update", {
        input: raceSchema,
        async resolve(req) {
            const { id, ...data } = req.input;
            return await db.race.update({ where: { id: id! }, data });
        }
    })
    .mutation("add", {
        input: raceSchema,
        async resolve(req) {
            const { id, ...data } = req.input;
            return await db.race.create({ data });
        }
    });

export type RaceRouter = typeof raceRouter;
