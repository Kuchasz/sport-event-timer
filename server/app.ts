import { appRouter } from "./router";
import { createContext } from "./trpc-context";
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
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

// const corsOptions = {
//     credentials: true,
//     preflightContinue: false,
//     origin: true,
//     methods: ["GET", "POST", "PUT", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"]
// };