import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { logger } from "../../src/utils";
import { type AppRouter, appRouter } from "./routers/app";
import { createContextStandalone, createContextWs } from "./trpc";
import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

const env = {
    NEXT_PUBLIC_API_PORT: 3001,
};

const port = env.NEXT_PUBLIC_API_PORT;
// const appPort = env.NEXT_PUBLIC_APP_PORT;
const dev = process.env.NODE_ENV !== "production";

const protocol = dev ? "http" : "https";

const { server, listen } = createHTTPServer({
    router: appRouter,
    createContext: createContextStandalone,
});

const wss = new WebSocketServer({ server });
const handler = applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext: createContextWs,
});

process.on("SIGTERM", () => {
    logger.log("SIGTERM");
    handler.broadcastReconnectNotification();
});

listen(port);
logger.log(`> Server listening at ${protocol}://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
