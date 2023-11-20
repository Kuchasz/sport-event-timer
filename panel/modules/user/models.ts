import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const loginSchema = z.object({
    email: z.string().email(sharedErrorCodes.email),
    password: z.string().nonempty(sharedErrorCodes.required),
});

export type Login = z.infer<typeof loginSchema>;
