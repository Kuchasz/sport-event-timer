import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";
import errorCodes from "./error-codes";

export const bibNumberSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number({ required_error: sharedErrorCodes.required }).min(1),
    number: z.string({ required_error: sharedErrorCodes.required }).min(1, sharedErrorCodes.required),
});

export const addRangeBibNumberSchema = z
    .object({
        raceId: z.number({ required_error: sharedErrorCodes.required }).min(1),
        startNumber: z.number({ required_error: sharedErrorCodes.required }).min(1),
        endNumber: z.number({ required_error: sharedErrorCodes.required }),
        omitDuplicates: z.boolean().nullish(),
    })
    .refine(data => data.endNumber > data.startNumber, {
        message: errorCodes.endNumber.higherThanStartNumber,
        path: ["endNumber"],
    });
