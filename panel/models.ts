import { z } from "zod";

export const genderEnum = z.enum(["male", "female"]);

export const timingPointTypeEnum = z.enum(["start", "finish", "checkpoint"]);
