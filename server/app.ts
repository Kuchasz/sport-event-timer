import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWs from "@trpc/server/adapters/ws";
import cors from "cors";
import express from "express";
import { appRouter } from "./router";
import { createContext } from "./trpc-context";
import { createServer } from "http";
import * as trpc from '@trpc/server';
import { createHTTPHandler, createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { z } from 'zod';
import * as http from "http";


export interface TypedRequestBody<T> extends Express.Request {
    body: T;
}

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
    router: appRouter,
    createContext: () => ({})
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    handler(req, res);
});

const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext
});

server.listen(3001);

// const app = express();
// const server = createServer(app);
// const corsOptions = {
//     credentials: true,
//     preflightContinue: false,
//     origin: true,
//     methods: ["GET", "POST", "PUT", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"]
// };

// const wss = new ws.Server({ server });
// const handler = trpcWs.applyWSSHandler({ wss, router: appRouter, createContext });

// const trpcExpressMiddleware = trpcExpress.createExpressMiddleware({
//     router: appRouter,
//     createContext
// });

// app.use(cors(corsOptions));
// app.use("/", trpcExpressMiddleware);

// process.on("SIGTERM", () => {
//     handler.broadcastReconnectNotification();
//     wss.close();
//     server.close();
// });

// server.listen(3001, "localhost", () => {
//     console.log("SERVER_STARTED_LISTENING");
// });
