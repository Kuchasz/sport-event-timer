import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    server: {
        DATABASE_URL: z.string().url(),
        // NODE_ENV: z.enum(["development", "test", "production"]),
        PORT: z
            .string()
            .regex(/[0-9]+/)
            .optional(),
        AUTH_PUBLIC_KEY: z.string(),
        AUTH_PRIVATE_KEY: z.string(),
        NOTIFICATIONS_SERVER_HOST: z.string(),
        NOTIFICATIONS_SERVER_PORT: z.string(),
        NOTIFICATIONS_SERVER_SECURE: z.string(),
        NOTIFICATIONS_SERVER_AUTH_USER: z.string(),
        NOTIFICATIONS_SERVER_AUTH_PASS: z.string(),
        NOTIFICATIONS_MESSAGE_FROM: z.string(),
        NOTIFICATIONS_MESSAGE_TARGET: z.string(),
        USER_REGISTRATION_ENABLED: z.boolean(),
        APP_PORT: z.number(),
        API_PORT: z.number(),
    },
    client: {
        NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_API_URL: z.string(),
        NEXT_PUBLIC_APP_PORT: z.number(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: process.env.PORT,
        AUTH_PUBLIC_KEY: process.env.AUTH_PUBLIC_KEY ? Buffer.from(process.env.AUTH_PUBLIC_KEY, "base64").toString("ascii") : undefined,
        AUTH_PRIVATE_KEY: process.env.AUTH_PRIVATE_KEY ? Buffer.from(process.env.AUTH_PRIVATE_KEY, "base64").toString("ascii") : undefined,
        NOTIFICATIONS_SERVER_HOST: process.env.NOTIFICATIONS_SERVER_HOST,
        NOTIFICATIONS_SERVER_PORT: process.env.NOTIFICATIONS_SERVER_PORT,
        NOTIFICATIONS_SERVER_SECURE: process.env.NOTIFICATIONS_SERVER_SECURE,
        NOTIFICATIONS_SERVER_AUTH_USER: process.env.NOTIFICATIONS_SERVER_AUTH_USER,
        NOTIFICATIONS_SERVER_AUTH_PASS: process.env.NOTIFICATIONS_SERVER_AUTH_PASS,
        NOTIFICATIONS_MESSAGE_FROM: process.env.NOTIFICATIONS_MESSAGE_FROM,
        NOTIFICATIONS_MESSAGE_TARGET: process.env.NOTIFICATIONS_MESSAGE_TARGET,
        NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_APP_PORT: Number(process.env.NEXT_PUBLIC_APP_PORT),
        APP_PORT: Number(process.env.APP_PORT),
        API_PORT: Number(process.env.API_PORT),
        USER_REGISTRATION_ENABLED: process.env.USER_REGISTRATION_ENABLED === "true",
    },
    emptyStringAsUndefined: true,
});
