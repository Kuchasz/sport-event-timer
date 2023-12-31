import { sportKinds } from "@set/utils/dist/sport-kind";
import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const sportKindEnum = z.enum(sportKinds, { required_error: sharedErrorCodes.required });

export const raceSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: sharedErrorCodes.required }).nonempty(),
    description: z.string({ required_error: sharedErrorCodes.required }),
    location: z.string({ required_error: sharedErrorCodes.required }).nonempty(),
    sportKind: sportKindEnum,
    date: z.date({ required_error: sharedErrorCodes.required }),
    termsUrl: z.string().nullish(),
    websiteUrl: z.string().url().nullish(),
    emailTemplate: z.string().nullish(),
    playersLimit: z.number().int().positive().nullish(),
    registrationEnabled: z.boolean(),
    registrationCutoff: z.date().nullish(),
    useSampleData: z.boolean().nullish(),
});

export type SportKind = z.infer<typeof sportKindEnum>;
