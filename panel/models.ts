import { z } from "zod";

export const GenderEnum = z.enum(["male", "female"]);

export const playerRegistrationSchema = z.object({
    id: z.number().nullish(),
    name: z.string().min(3),
    lastName: z.string().min(3),
    gender: GenderEnum,
    birthDate: z.date(),
    country: z.string(),
    city: z.string(),
    team: z.string().nullish(),
    email: z.string().email("Email is not valid"),
    phoneNumber: z.string(),
    icePhoneNumber: z.string().nullish(),
    hasPaid: z.boolean()
});

export const racePlayerRegistrationSchema = z.object({
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    player: playerRegistrationSchema
});
