import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const loginSchema = z.object({
    email: z.string().email(sharedErrorCodes.email),
    password: z.string().nonempty(sharedErrorCodes.required),
});

export const registrationSchema = z.object({
    name: z.string().nonempty(sharedErrorCodes.required),
    email: z.string().email(sharedErrorCodes.email),
    password: z.string().nonempty(sharedErrorCodes.required),
    confirmPassword: z.string().nonempty(sharedErrorCodes.required),
});

export type UserLogin = z.infer<typeof loginSchema>;
export type UserRegistration = z.infer<typeof registrationSchema>;
