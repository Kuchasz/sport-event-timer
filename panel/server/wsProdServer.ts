import * as dotenv from "dotenv";
import * as path from "path";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { type AppRouter, appRouter } from "./routers/app";
import { createContextStandalone, createContextWs } from "./trpc";
import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { logger } from "utils";
import cors from "cors";

dotenv.config({ path: path.join(__dirname, ".env") });

const env = {
    NEXT_PUBLIC_API_PORT: 3002,
    NEXT_PUBLIC_API_URL: "app.rura.cc",
};

const port = env.NEXT_PUBLIC_API_PORT;
// const appPort = env.NEXT_PUBLIC_APP_PORT;
const dev = process.env.NODE_ENV !== "production";

const protocol = dev ? "http" : "https";

const { server, listen } = createHTTPServer({
    // middleware: cors({
    //     origin: `${protocol}://${env.NEXT_PUBLIC_APP_URL}:${appPort}`,
    // }),
    middleware: cors({
        origin: ["http://localhost:3000", "https://app.rura.cc", "https://app.rura.cc:3000", "https://app.rura.cc:3001"],
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
logger.log(`> Server listening at ${protocol}://${env.NEXT_PUBLIC_API_URL}:${port} as ${dev ? "development" : process.env.NODE_ENV}`);

// const app = next({ dev });
// const handle = app.getRequestHandler();

// void app.prepare().then(() => {
//     const server = http.createServer((req, res) => {
//         const proto = req.headers["x-forwarded-proto"];
//         if (proto && proto === "http") {
//             // redirect to ssl
//             res.writeHead(303, {
//                 //eslint-disable-next-line @typescript-eslint/restrict-plus-operands
//                 location: `https://` + req.headers.host! + (req.headers.url ?? ""),
//             });
//             res.end();
//             return;
//         }
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         const parsedUrl = parse(req.url!, true);
//         void handle(req, res, parsedUrl);
//     });
//     const wss = new WebSocketServer({ server });
//     const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContextWs });

//     process.on("SIGTERM", () => {
//         logger.log("SIGTERM");
//         handler.broadcastReconnectNotification();
//     });
//     server.listen(port);

//     logger.log(`> Server listening at http://${env.NEXT_PUBLIC_APP_URL}:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
// });
