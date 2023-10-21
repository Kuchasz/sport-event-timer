import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const apiKeySchema = z.object({
    id: z.number().nullish(),
    name: z.string({ required_error: sharedErrorCodes.required }),
});

export const raceApiKeySchema = z.object({
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    key: apiKeySchema,
});
