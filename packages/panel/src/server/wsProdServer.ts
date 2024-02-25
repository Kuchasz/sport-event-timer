import { createHTTPServer } from "@trpc/server/adapters/standalone";
import * as dotenv from "dotenv";
import * as path from "path";
import { logger } from "../../src/utils";
import { appRouter } from "./routers/app";
import { createContextStandalone } from "./trpc";

dotenv.config({ path: path.resolve(".env") });

const env = {
    NEXT_PUBLIC_API_PORT: 3001,
};

const port = env.NEXT_PUBLIC_API_PORT;
// const appPort = env.NEXT_PUBLIC_APP_PORT;
const dev = process.env.NODE_ENV !== "production";

const protocol = dev ? "http" : "https";

const { listen } = createHTTPServer({
    router: appRouter,
    createContext: createContextStandalone,
});

// const wss = new WebSocketServer({ server });
// const handler = applyWSSHandler<AppRouter>({
//     wss,
//     router: appRouter,
//     createContext: createContextWs,
// });

// process.on("SIGTERM", () => {
//     logger.log("SIGTERM");
//     handler.broadcastReconnectNotification();
// });

listen(port);
logger.log(`> Server listening at ${protocol}://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
