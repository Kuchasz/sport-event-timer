import { z } from "zod";

export const genderEnum = z.enum(["male", "female"]);
