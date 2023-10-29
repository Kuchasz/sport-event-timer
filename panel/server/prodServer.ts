import { createContext } from "./trpc";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import http from "http";
import next from "next";
import { parse } from "url";
import ws from "ws";
import { appRouter } from "./routers/app";
import { logger } from "../utils";
import * as dotenv from "dotenv";
import * as path from "path";
import { env } from "env";

dotenv.config({ path: path.resolve(".env") });

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
    const server = http.createServer((req, res) => {
        const proto = req.headers["x-forwarded-proto"];
        if (proto && proto === "http") {
            // redirect to ssl
            res.writeHead(303, {
                //eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                location: `https://` + req.headers.host! + (req.headers.url ?? ""),
            });
            res.end();
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const parsedUrl = parse(req.url!, true);
        void handle(req, res, parsedUrl);
    });
    const wss = new ws.Server({ server });
    const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContext(true) });

    process.on("SIGTERM", () => {
        logger.log("SIGTERM");
        handler.broadcastReconnectNotification();
    });
    server.listen(env.NEXT_PUBLIC_APP_HTTP_PORT);

    logger.log(`> Server listening at http://${env.NEXT_PUBLIC_APP_URL}:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
});
