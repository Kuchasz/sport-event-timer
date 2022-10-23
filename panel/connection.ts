import superjson from "superjson";
import { createTRPCNext } from "@trpc/next";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";

import { splitLink } from "@trpc/client/links/splitLink";
import { createTRPCProxyClient } from '@trpc/client';

import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "./server/routers/app";
import { createTRPCReact } from "@trpc/react";

const url =
    process.env.NODE_ENV === "production" ? `https://api.rura.cc` : "http://localhost:3000";

const wsUrl =
    process.env.NODE_ENV === "production" ? `wss://api.rura.cc` : "ws://localhost:3000";

const wsClient =
    typeof window === "undefined"
        ? null
        : createWSClient({
            url: wsUrl
        });

export const getConnection = wsClient?.getConnection;

const runStateChangedHandlers = (s: ConnectionState) => {
    onStateChangedHandlers.forEach(x => x(s));
};

const registerStateChangeHandlers = (getConnection: () => WebSocket) => {
    let previousState = 0;

    setInterval(() => {
        const socket = getConnection();
        const currentState = socket.readyState;
        if (currentState === previousState) return;

        previousState = currentState;

        runStateChangedHandlers(
            currentState === 0
                ? "connecting"
                : currentState === 1
                    ? "connected"
                    : currentState === 2
                        ? "disconnected"
                        : "error"
        );
    }, 500);
};

if (getConnection)
    registerStateChangeHandlers(getConnection);

const createConnectionConfig = () => ({
    transformer: superjson,
    links: [
        loggerLink({
            enabled: opts =>
                (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
                (opts.direction === "down" && opts.result instanceof Error)
        }),
        splitLink({
            condition(op) {
                return op.type === "subscription";
            },
            true:
                wsClient !== null
                    ? wsLink({
                        client: wsClient
                    })
                    : httpBatchLink({
                        url: `${url}/api/trpc`
                    }),
            false: httpBatchLink({
                url: `${url}/api/trpc`
            })
        })
    ]
})

export const queryClient = new QueryClient();
export const trpcClient = createTRPCProxyClient<AppRouter>(createConnectionConfig());
export const trpc = createTRPCReact<AppRouter>();
export const trpcNext = createTRPCNext({ config() { return createConnectionConfig() }, ssr: false });

 
export type ConnectionState = "connected" | "connecting" | "disconnected" | "error";

type ConnectionStateHandler = (s: ConnectionState) => void;
const onStateChangedHandlers = [] as ConnectionStateHandler[];
export const onConnectionStateChanged = (handler: ConnectionStateHandler) => {
    onStateChangedHandlers.push(handler);
    return () => {
        onStateChangedHandlers.splice(onStateChangedHandlers.indexOf(handler), 1);
    };
}; //possible memory leaks
