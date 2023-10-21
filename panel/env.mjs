import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
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
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
    emptyStringAsUndefined: true,
});
