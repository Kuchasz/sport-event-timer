import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";
import errorCodes from "./error-codes";

export const timingPointTypeEnum = z.enum(["start", "finish", "checkpoint"]);

export const timingPointSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: sharedErrorCodes.required }).min(1),
    name: z.string({ required_error: sharedErrorCodes.required }).nonempty(sharedErrorCodes.required),
    abbrev: z.string({ required_error: sharedErrorCodes.required }).nonempty(sharedErrorCodes.required).max(3, errorCodes.abbrev.length),
    description: z.string().max(100, errorCodes.description.length).nullish(),
});

export const timingPointAccessUrlSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    timingPointId: z.number({ required_error: sharedErrorCodes.required }),
    code: z.string().nullable(),
    name: z.string({ required_error: sharedErrorCodes.required }),
    canAccessOthers: z.boolean(),
});

export type TimingPointType = z.infer<typeof timingPointTypeEnum>;
