import superjson from "superjson";
import { type AppRouter } from "./server/routers/app";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
// import { env } from "env";
// import { headers } from "next/headers";

const url =
    // env.NEXT_PUBLIC_NODE_ENV === "production"
    //     ? `https://${env.NEXT_PUBLIC_APP_URL}`
    //     : `http://${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_API_PORT}`;
    "http://127.0.0.1:3002";

export const trpcRSC = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        // loggerLink({
        //     enabled: op => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
        // }),
        httpBatchLink({
            // url: `${url}/api/trpc`,
            url,
            // headers() {
            //     return Object.fromEntries(new Map(headers()));
            // },
        }),
    ],
});
