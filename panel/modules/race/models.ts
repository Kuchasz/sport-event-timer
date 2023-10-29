import { sportKinds } from "@set/utils/dist/sport-kind";
import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const sportKindEnum = z.enum(sportKinds, { required_error: sharedErrorCodes.required });

export const raceSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: "name is required" }),
    description: z.string({ required_error: "description is required" }),
    location: z.string({ required_error: "location is required" }),
    sportKind: sportKindEnum,
    date: z.date({ required_error: "date is required" }),
    termsUrl: z.string().nullish(),
    emailTemplate: z.string().nullish(),
    playersLimit: z.number().int().positive().nullish(),
    registrationEnabled: z.boolean(),
    useSampleData: z.boolean().nullish(),
});

export type SportKind = z.infer<typeof sportKindEnum>;
