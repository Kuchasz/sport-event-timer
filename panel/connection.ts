"use client";

import superjson from "superjson";
import { splitLink, createWSClient, wsLink, httpBatchLink } from "@trpc/client";
import type { QueryClient } from "@tanstack/react-query";
import { env } from "./env";

const url =
    env.NEXT_PUBLIC_NODE_ENV === "production"
        ? `https://${env.NEXT_PUBLIC_APP_URL}`
        : `http://${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_APP_HTTP_PORT}`;

const wsUrl =
    env.NEXT_PUBLIC_NODE_ENV === "production"
        ? `wss://${env.NEXT_PUBLIC_APP_URL}`
        : `ws://${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_APP_WS_PORT}`;

const wsClient =
    typeof window === "undefined"
        ? null
        : createWSClient({
              url: wsUrl,
          });

//eslint-disable-next-line @typescript-eslint/unbound-method
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
            currentState === socket.CONNECTING
                ? "connecting"
                : currentState === socket.OPEN
                ? "connected"
                : currentState === socket.CLOSED
                ? "disconnected"
                : "error",
        );
    }, 250);
};

if (getConnection) registerStateChangeHandlers(getConnection);

export const connectionConfig = (queryClient: QueryClient) => ({
    transformer: superjson,
    ssr: true,
    queryClient,
    links: [
        // loggerLink({
        //     enabled: opts =>
        //         (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
        //         (opts.direction === "down" && opts.result instanceof Error),
        // }),
        splitLink({
            condition(op) {
                return wsClient !== null && (op.type === "subscription" || op.path === "action.dispatch");
            },
            true: wsLink({
                client: wsClient!,
            }),
            false: httpBatchLink({
                url: `${url}/api/trpc`,
            }),
        }),
    ],
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

export const allowedLatency = 200;
