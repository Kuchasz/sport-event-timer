import * as trpc from "@trpc/server";
import { db } from "../db";
import { z } from "zod";

const classificationSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" })
});

export const classificationRouter = trpc
    .router()
    .query("classifications", {
        input: z.object({
            raceId: z.number({ required_error: "raceId is required" })
        }),
        async resolve(req) {
            const raceId = req.input.raceId;
            return await db.classification.findMany({ where: { raceId } });
        }
    })
    .mutation("upload", {
        input: z.object({
            classifications: z.array(
                z.object({
                    name: z.string({ required_error: "name is required" })
                })
            ),
            raceId: z.number().min(1)
        }),
        async resolve(req) {
            const { classifications, raceId } = req.input;
            classifications.forEach(async classification => {
                await db.classification.create({ data: { ...classification, raceId } });
            });
            // db.classification.create({})
            // return await fs.writeJsonAsync(classifications, "../classifications.json");
        }
    })
    .mutation("update", {
        input: classificationSchema,
        async resolve(req) {
            const { id, ...data } = req.input;
            return await db.classification.update({ where: { id: id! }, data });
        }
    })
    .mutation("add", {
        input: classificationSchema,
        async resolve(req) {
            const { id, ...data } = req.input;
            return await db.classification.create({ data });
        }
    });

export type ClassificationRouter = typeof classificationRouter;
