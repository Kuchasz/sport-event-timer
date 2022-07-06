import * as fs from "../async-fs";
import * as trpc from "@trpc/server";
import { Classification } from "@set/timer/model";
import { z } from "zod";

export const classificationRouter = trpc
    .router()
    .query("classifications", {
        async resolve() {
            return await fs.readJsonAsync<Classification[]>("../classifications.json");
        }
    })
    .mutation("upload", {
        input: z.object({
            classifications: z.array(
                z.object({
                    id: z
                        .string({ required_error: "id is required" })
                        .regex(/^\w+$/, "id must contain only characters, numbers and underscore"),
                    name: z.string({ required_error: "name is required" })
                })
            )
        }),
        async resolve(req) {
            const { classifications } = req.input;
            return await fs.writeJsonAsync(classifications, "../classifications.json");
        }
    });

export type ClassificationRouter = typeof classificationRouter;
