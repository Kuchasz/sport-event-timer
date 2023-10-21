import superjson from "superjson";
import { type AppRouter } from "./server/routers/app";
import { createTRPCProxyClient, loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { env } from "env/client";
import { headers } from "next/headers";

const url = env.NEXT_PUBLIC_NODE_ENV === "production" ? `https://app.rura.cc` : "http://localhost:3000";

export const trpcRSC = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        loggerLink({
            enabled: op => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
            url: `${url}/api/trpc`,
            headers() {
                return Object.fromEntries(new Map(headers()));
            },
        }),
    ],
});
