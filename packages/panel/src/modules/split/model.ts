import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const splitSchema = z.object({
    id: z.number(),
    name: z.string({ required_error: sharedErrorCodes.required }).min(1, sharedErrorCodes.required),
    distanceFromStart: z.number().nullable(),
    classificationId: z.number({ required_error: sharedErrorCodes.required }),
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    timingPointId: z.number({ required_error: sharedErrorCodes.required }),
});
