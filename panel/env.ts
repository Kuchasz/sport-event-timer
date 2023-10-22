import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    skipValidation: true,
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(["development", "test", "production"]),
        PORT: z
            .string()
            .regex(/[0-9]+/)
            .optional(),
        NEXTAUTH_URL: z.preprocess(
            // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
            // Since NextAuth automatically uses the VERCEL_URL if present.
            str => process.env.VERCEL_URL ?? str,
            // VERCEL_URL doesnt include `https` so it cant be validated as a URL
            process.env.VERCEL ? z.string() : z.string().url(),
        ),
        NEXTAUTH_SECRET: z.string(),
        AUTH0_CLIENT_ID: z.string(),
        AUTH0_CLIENT_SECRET: z.string(),
        AUTH0_ISSUER: z.string(),
        NOTIFICATIONS_SERVER_HOST: z.string(),
        NOTIFICATIONS_SERVER_PORT: z.string(),
        NOTIFICATIONS_SERVER_SECURE: z.string(),
        NOTIFICATIONS_SERVER_AUTH_USER: z.string(),
        NOTIFICATIONS_SERVER_AUTH_PASS: z.string(),
        NOTIFICATIONS_MESSAGE_FROM: z.string(),
        NOTIFICATIONS_MESSAGE_TARGET: z.string(),
    },
    client: {
        NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: process.env.PORT,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_ISSUER: process.env.AUTH0_ISSUER,
        NOTIFICATIONS_SERVER_HOST: process.env.NOTIFICATIONS_SERVER_HOST,
        NOTIFICATIONS_SERVER_PORT: process.env.NOTIFICATIONS_SERVER_PORT,
        NOTIFICATIONS_SERVER_SECURE: process.env.NOTIFICATIONS_SERVER_SECURE,
        NOTIFICATIONS_SERVER_AUTH_USER: process.env.NOTIFICATIONS_SERVER_AUTH_USER,
        NOTIFICATIONS_SERVER_AUTH_PASS: process.env.NOTIFICATIONS_SERVER_AUTH_PASS,
        NOTIFICATIONS_MESSAGE_FROM: process.env.NOTIFICATIONS_MESSAGE_FROM,
        NOTIFICATIONS_MESSAGE_TARGET: process.env.NOTIFICATIONS_MESSAGE_TARGET,
        NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    },
    emptyStringAsUndefined: true,
});
