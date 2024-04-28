import { genderEnum } from "../shared/models";
import { z } from "zod";

export const categorySchema = z.object({
    id: z.number().min(1).optional(),
    classificationId: z.number({ required_error: "classificationId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    abbrev: z.string({ required_error: "abbrev is required" }).min(1).max(5),
    gender: genderEnum.nullish(),
    minAge: z.number().min(1).nullish(),
    maxAge: z.number().max(199).nullish(),
    isSpecial: z.boolean(),
});

export const classificationSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
});
