import { createHTTPServer } from "@trpc/server/adapters/standalone";
import * as dotenv from "dotenv";
import { env } from "env";
import * as path from "path";
import { type AppRouter, appRouter } from "./routers/app";
import { createContextStandalone, createContextWs } from "./trpc";
import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { logger } from "utils";
import cors from "cors";

dotenv.config({ path: path.resolve(".env") });

const port = env.API_PORT;
// const appPort = env.NEXT_PUBLIC_APP_PORT;
const dev = process.env.NODE_ENV !== "production";

const protocol = dev ? "http" : "https";

const { server, listen } = createHTTPServer({
    // middleware: cors({
    //     origin: `${protocol}://${env.NEXT_PUBLIC_APP_URL}:${appPort}`,
    // }),
    middleware: cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    }),
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
