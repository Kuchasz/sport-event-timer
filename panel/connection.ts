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

const runStateChangedHandlers = (s: ConnectionState) => {
    onStateChangedHandlers.forEach(x => x(s));
};

const registerStateChangeHandlers = (socket: WebSocket) => {
    let previousState = 0;

    setInterval(() => {
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

type WSClient = ReturnType<typeof createWSClient>;

let websocketClient: WSClient;
const getWsClient = () => {
    if (typeof window === "undefined") return null;

    if (!websocketClient) {
        websocketClient = createWSClient({
            url: wsUrl,
        });

        registerStateChangeHandlers(websocketClient.getConnection());
    }
    return websocketClient;
};

export const getConnection = () => getWsClient()?.getConnection();

export const connectionConfig = (queryClient: QueryClient, enableSubscriptions: boolean) => ({
    transformer: superjson,
    ssr: true,
    queryClient,
    links: [
        // loggerLink({
        //     enabled: opts =>
        //         (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
        //         (opts.direction === "down" && opts.result instanceof Error),
        // }),
        enableSubscriptions
            ? splitLink({
                  condition(op) {
                      return getWsClient() !== null && (op.type === "subscription" || op.path === "action.dispatch");
                  },
                  true: wsLink({
                      client: getWsClient()!,
                  }),
                  false: httpBatchLink({
                      url: `${url}/api/trpc`,
                  }),
              })
            : httpBatchLink({
                  url: `${url}/api/trpc`,
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
