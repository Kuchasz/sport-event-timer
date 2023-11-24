import { z } from "zod";

export const timePenaltySchema = z.object({
    raceId: z.number(),
    bibNumber: z.string(),
    time: z.number(),
    reason: z.string(),
});
