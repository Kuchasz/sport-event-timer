import superjson from "superjson";
import { createTRPCClient } from "@trpc/react";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { QueryClient } from "react-query";
import { splitLink } from "@trpc/client/links/splitLink";

import type { AppRouter } from "@set/server/router";

const url =
    process.env.NODE_ENV === "production" ? `http://20.234.101.215:21822/api/trpc` : "http://localhost:21822/api/trpc";

const wsUrl =
    process.env.NODE_ENV === "production" ? `ws://20.234.101.215:21822/api/trpc` : "ws://localhost:21822/api/trpc";

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

export const queryClient = new QueryClient();
export const trpcClient = createTRPCClient<AppRouter>({
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
                        url
                    }),
            false: httpBatchLink({
                url
            })
        })
    ]
});

export type ConnectionState = "connected" | "connecting" | "disconnected" | "error";

type ConnectionStateHandler = (s: ConnectionState) => void;
const onStateChangedHandlers = [] as ConnectionStateHandler[];
export const onConnectionStateChanged = (handler: ConnectionStateHandler) => {
    onStateChangedHandlers.push(handler);
    return () => {
        onStateChangedHandlers.splice(onStateChangedHandlers.indexOf(handler), 1);
    };
}; //possible memory leaks
