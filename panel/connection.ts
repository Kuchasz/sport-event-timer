import superjson from "superjson";
import { createTRPCNext } from "@trpc/next";
import { splitLink, createWSClient, wsLink, loggerLink, httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "./server/routers/app";
import { env } from "env/server.mjs";

const url =
    env.NODE_ENV === "production" ? `https://app.rura.cc` : "http://localhost:3000";

const wsUrl =
    env.NODE_ENV === "production" ? `wss://app.rura.cc` : "ws://localhost:3001";

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

const connectionConfig = ({
    transformer: superjson,
    queryClient,
    links: [
        loggerLink({
            enabled: opts =>
                (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
                (opts.direction === "down" && opts.result instanceof Error)
        }),
        splitLink({
            condition(op) {
                return wsClient !== null && (op.type === "subscription" || op.path === "action.dispatch");
            },
            true: wsLink({
                client: wsClient!
            }),
            false: httpBatchLink({
                url: `${url}/api/trpc`
            })
        })
    ]
})

export const trpc = createTRPCNext<AppRouter>({ config() { return connectionConfig }, ssr: false });

export type ConnectionState = "connected" | "connecting" | "disconnected" | "error";

type ConnectionStateHandler = (s: ConnectionState) => void;
const onStateChangedHandlers = [] as ConnectionStateHandler[];
export const onConnectionStateChanged = (handler: ConnectionStateHandler) => {
    onStateChangedHandlers.push(handler);
    return () => {
        onStateChangedHandlers.splice(onStateChangedHandlers.indexOf(handler), 1);
    };
}; //possible memory leaks
