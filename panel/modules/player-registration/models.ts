import { GenderEnum } from "models";
import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const playerRegistrationSchema = z.object({
    id: z.number().nullish(),
    name: z
        .string()
        .min(3, sharedErrorCodes.required),
    lastName: z
        .string()
        .min(3, sharedErrorCodes.required),
    gender: GenderEnum,
    birthDate: z.date({ required_error: sharedErrorCodes.required }),
    country: z
        .string({ required_error: sharedErrorCodes.required })
        .nonempty(sharedErrorCodes.required),
    city: z
        .string()
        .nonempty(sharedErrorCodes.required),
    team: z.string().nullish(),
    email: z
        .string({ required_error: sharedErrorCodes.required })
        .email(sharedErrorCodes.email),
    phoneNumber: z
        .string()
        .min(8, sharedErrorCodes.required),
    icePhoneNumber: z.string().nullish(),
    hasPaid: z.boolean().nullish()
});

export const racePlayerRegistrationSchema = z.object({
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    player: playerRegistrationSchema
});

export type PlayerRegistration = z.infer<typeof playerRegistrationSchema>;