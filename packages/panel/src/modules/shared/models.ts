import { z } from "zod";

export const genderEnum = z.enum(["male", "female"]);

export type Gender = z.infer<typeof genderEnum>;
