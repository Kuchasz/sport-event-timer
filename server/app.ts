import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWs from "@trpc/server/adapters/ws";
import cors from "cors";
import express from "express";
import ws from "ws";
import { appRouter } from "./router";
import { createContext } from "./trpc-context";
import { createServer } from "http";

export interface TypedRequestBody<T> extends Express.Request {
    body: T;
}

const app = express();
const server = createServer(app);
const corsOptions = {
    credentials: true,
    preflightContinue: false,
    origin: true,
    methods: ["GET", "POST", "PUT", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
};

const wss = new ws.Server({ server });
const handler = trpcWs.applyWSSHandler({ wss, router: appRouter, createContext });

const trpcExpressMiddleware = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
});

app.use(cors(corsOptions));
app.use("/api/trpc", trpcExpressMiddleware);

process.on("SIGTERM", () => {
    handler.broadcastReconnectNotification();
    wss.close();
    server.close();
});

server.listen(3001, "localhost", () => {
    console.log("SERVER_STARTED_LISTENING");
});
