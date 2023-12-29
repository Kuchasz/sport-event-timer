import superjson from "superjson";
import { type AppRouter } from "./server/routers/app";
import { createTRPCProxyClient, unstable_httpBatchStreamLink } from "@trpc/client";
// import { env } from "env";
import { headers } from "next/headers";

const url =
    // env.NEXT_PUBLIC_NODE_ENV === "production"
    //     ? `https://${env.NEXT_PUBLIC_APP_URL}`
    //     : `http://${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_API_PORT}`;
    "http://localhost:3002";

export const trpcRSC = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        // loggerLink({
        //     enabled: op => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
        // }),
        unstable_httpBatchStreamLink({
            // url: `${url}/api/trpc`,
            url,
            headers() {
                console.log(headers());
                return Object.fromEntries(new Map(headers()));
            },
        }),
    ],
});
