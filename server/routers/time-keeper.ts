import * as trpc from "@trpc/server";
import { db } from "../db";
import { z } from "zod";

export const timeKeeperRouter = trpc
    .router()
    .query("timeKeepers", {
        input: z.object({
            raceId: z.number({ required_error: "raceId is required" })
        }),
        async resolve(req) {
            const raceId = req.input.raceId;
            return await db.timeKeeper.findMany({ where: { raceId } });
        }
    })
    .mutation("update", {
        input: z.object({
            id: z.number().min(1),
            name: z.string({ required_error: "name is required" }),
            order: z.number({ required_error: "order is required" })
        }),
        async resolve(req) {
            const { id, ...data } = req.input;
            return await db.classification.update({ where: { id }, data });
        }
    })
    .mutation("add", {
        input: z.object({
            raceId: z.number({ required_error: "raceId is required" }).min(1),
            name: z.string({ required_error: "name is required" }),
            order: z.number({ required_error: "order is required" })
        }),
        async resolve(req) {
            return await db.timeKeeper.create({ data: req.input });
        }
    });

export type RaceRouter = typeof timeKeeperRouter;
