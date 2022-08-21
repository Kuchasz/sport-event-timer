import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWs from "@trpc/server/adapters/ws";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import ws from "ws";
import { appRouter } from "./router";
import {
    UserCredentials
} from "@set/shared/dist";
import { config } from "./config";
import { createContext } from "./trpc-context";
import { createServer } from "http";
import { login, verify } from "./auth";
import { Response } from "express";

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
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use("/api/trpc", trpcExpressMiddleware);

process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
    server.close();
});


app.post("/log-in", async (req: TypedRequestBody<UserCredentials>, res: Response) => {
    try {
        const tokens = await login(req.body);
        const result = {
            authToken: tokens.encodedToken,
            issuedAt: tokens.iat,
            expireDate: tokens.exp
        };

        res.cookie(config.auth.cookieName, result.authToken, {
            httpOnly: true,
            maxAge: config.auth.maxAge * 1000
        });

        res.json(result);
        return;
    } catch (err) {
        console.log(err);
    }

    res.sendStatus(401);
});

server.listen(3001, "localhost", () => {
    console.log("SERVER_STARTED_LISTENING");
});
