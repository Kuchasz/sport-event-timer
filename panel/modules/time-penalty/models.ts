import { z } from "zod";

export const timePenaltySchema = z.object({
    id: z.number().nullish(),
    raceId: z.number(),
    bibNumber: z.string(),
    time: z.number(),
    reason: z.string(),
});
