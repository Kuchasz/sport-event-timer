import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const splitSchema = z.object({
    id: z.number(),
    name: z.string({ required_error: sharedErrorCodes.required }).nonempty(sharedErrorCodes.required),
    classificationId: z.number({ required_error: sharedErrorCodes.required }),
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    timingPointId: z.number({ required_error: sharedErrorCodes.required }),
});
