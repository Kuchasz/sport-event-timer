import { z } from "zod";

export const GenderEnum = z.enum(["male", "female"]);