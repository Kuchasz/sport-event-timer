import * as trpc from "@trpc/server";
import { db } from "../db";
import { z } from "zod";

export const classificationRouter = trpc
    .router()
    .query("classifications", {
        async resolve() {
            return await db.classification.findMany();
            // return await fs.readJsonAsync<Classification[]>("../classifications.json");
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
        input: z.object({
            id: z.number().min(1),
            name: z.string({ required_error: "name is required" })
        }),
        async resolve(req) {
            const { id, ...data } = req.input;
            await db.classification.update({ where: { id }, data });
            return null;
        }
    });

export type ClassificationRouter = typeof classificationRouter;
