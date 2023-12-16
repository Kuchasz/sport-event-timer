import { z } from "zod";

export const disqualificationSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number(),
    bibNumber: z.string(),
    reason: z.string(),
});
