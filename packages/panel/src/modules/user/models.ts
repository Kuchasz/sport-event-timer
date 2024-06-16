import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const loginSchema = z.object({
    email: z.string().email(sharedErrorCodes.email),
    password: z.string().min(1, sharedErrorCodes.required),
});

export const registrationSchema = z
    .object({
        name: z.string().min(1, sharedErrorCodes.required),
        email: z.string().email(sharedErrorCodes.email),
        password: z.string().min(1, sharedErrorCodes.required),
        confirmPassword: z.string().min(1, sharedErrorCodes.required),
    })
    .refine(registration => registration.password === registration.confirmPassword, {
        message: sharedErrorCodes.passwordMatch,
        path: ["confirmPassword"],
    });

export type UserLogin = z.infer<typeof loginSchema>;
export type UserRegistration = z.infer<typeof registrationSchema>;
