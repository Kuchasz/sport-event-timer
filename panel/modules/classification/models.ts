import { z } from "zod";

export const classificationSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
});
