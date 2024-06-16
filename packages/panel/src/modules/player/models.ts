import { genderEnum } from "../shared/models";
import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const playerProfileSchema = z.object({
    id: z.number().nullish(),
    name: z.string({ required_error: sharedErrorCodes.required }).min(1, sharedErrorCodes.required),
    lastName: z.string({ required_error: sharedErrorCodes.required }).min(1, sharedErrorCodes.required),
    gender: genderEnum,
    birthDate: z.date({ required_error: sharedErrorCodes.required }),
    country: z.string().nullish(),
    city: z.string().nullish(),
    team: z.string().nullish(),
    email: z.string().email(sharedErrorCodes.email).nullish(),
    phoneNumber: z.string().nullish(),
    icePhoneNumber: z.string().nullish(),
});

export const playerPromotionSchema = z.object({
    bibNumber: z.string(),
    startTime: z.number().optional(),
    classificationId: z.number().int(),
});

export const playerRegistrationSchema = z.object({
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    player: playerProfileSchema,
});

export const playerSchema = z.object({
    id: z.number().nullish(),
    classificationId: z.number({ required_error: sharedErrorCodes.required }),
    bibNumber: z.string(),
    startTime: z.number().optional(),
});

export const racePlayerSchema = z.object({
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    player: playerSchema,
});

export const racePlayerRegistrationSchema = z.object({
    raceId: z.number({ required_error: sharedErrorCodes.required }),
    player: playerSchema,
});
