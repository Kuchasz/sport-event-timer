import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const splitTimeSchema = z.object({
    id: z.number().min(1).nullish(),
    bibNumber: z.string({ required_error: sharedErrorCodes.required }),
    time: z.number().optional(),
    timingPointId: z.number({ required_error: sharedErrorCodes.required }),
});

export const manualSplitTimeSchema = splitTimeSchema.extend({ raceId: z.number({ required_error: sharedErrorCodes.required }) });
