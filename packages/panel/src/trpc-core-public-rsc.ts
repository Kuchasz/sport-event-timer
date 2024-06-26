import superjson from "superjson";
import { type AppRouter } from "./server/routers/app";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { env } from "./env";

const url = `http://localhost:${env.API_PORT}`;

export const publicTrpcRSC = createTRPCProxyClient<AppRouter>({
    links: [
        // loggerLink({
        //     enabled: op => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
        // }),
        httpBatchLink({
            transformer: superjson,
            fetch: (req, options) => fetch(req, { ...options, next: { revalidate: 10 } }),
            url,
        }),
    ],
});
