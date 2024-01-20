import { sportKinds } from "@set/utils/dist/sport-kind";
import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";
import errorCodes from "./error-codes";
import { isPast } from "@set/utils/dist/datetime";

export const sportKindEnum = z.enum(sportKinds, { required_error: sharedErrorCodes.required });
export const registrationStatesEnum = z.enum(["enabled", "disabled", "limit-reached", "cutoff"], {
    required_error: sharedErrorCodes.required,
});

export const raceInformationSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: sharedErrorCodes.required }).nonempty(),
    description: z.string({ required_error: sharedErrorCodes.required }),
    location: z.string({ required_error: sharedErrorCodes.required }).nonempty(),
    sportKind: sportKindEnum,
    date: z.date({ required_error: sharedErrorCodes.required }),
    websiteUrl: z.string().url().nullish(),
});

export const raceSchema = raceInformationSchema
    .extend({
        termsUrl: z.string().nullish(),
        emailTemplate: z.string().nullish(),
        playersLimit: z.number().int().positive().nullish(),
        registrationEnabled: z.boolean(),
        registrationCutoff: z.date().nullish(),
        useSampleData: z.boolean().nullish(),
    })
    .refine(data => !data.registrationCutoff || data.date > data.registrationCutoff, {
        message: errorCodes.registrationCutoff.higherThanDate,
        path: ["registrationCutoff"],
    });

export const getRegistrationState = (
    race: Pick<Race, "registrationEnabled" | "playersLimit" | "registrationCutoff">,
    registeredPlayers: number,
): RegistrationState => {
    if (!race.registrationEnabled) return "disabled";

    if (race.playersLimit && registeredPlayers > race.playersLimit) return "limit-reached";

    if (race.registrationCutoff && isPast(race.registrationCutoff)) return "cutoff";

    return "enabled";
};

export type SportKind = z.infer<typeof sportKindEnum>;
export type Race = z.infer<typeof raceSchema>;
export type RegistrationState = z.infer<typeof registrationStatesEnum>;
