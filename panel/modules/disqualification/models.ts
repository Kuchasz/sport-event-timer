import { z } from "zod";

export const disqualificationSchema = z.object({
    raceId: z.number(),
    bibNumber: z.string(),
    reason: z.string(),
});
