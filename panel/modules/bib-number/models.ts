import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const bibNumberSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number({ required_error: sharedErrorCodes.required }).min(1),
    number: z.string({ required_error: sharedErrorCodes.required }).nonempty(sharedErrorCodes.required),
});
