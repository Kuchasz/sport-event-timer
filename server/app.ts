import cors from "cors";
import express from "express";
import { apply as applyHub } from "@set/hub";
import { apply as applyResults } from "@set/results";
import { config } from "./config";
import { createServer } from "http";
import { login } from "./auth";
import { readFile, stat } from "fs";
import { resolve } from "path";
import { Response } from "express";
import { UserCredentials } from "@set/shared";

const requireModule = (path: string) => resolve(__dirname + `/../node_modules/${path}`);

const isDevelopment = process.env.NODE_ENV === "development";

export interface TypedRequestBody<T> extends Express.Request {
    body: T;
}

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
const server = createServer(app);

const run = async () => {
    app.use("/timer", express.static(requireModule("@set/mobile/build")));
    app.get("/timer/*", (_, res) => res.sendFile(requireModule("@set/mobile/build/index.html")));
    app.get("/state", (_, res) => {
        readFile(resolve("../state.json"), (err, data) => {
            if (err) throw err;
            res.json(JSON.parse(data as any));
        });
    });
    app.get("/players", (_, res) => {
        readFile(resolve("../players.json"), (err, data) => {
            const players = err ? [] : JSON.parse(data as any);
            res.json(players);
        });
    });
    app.get("/players-date", (_, res) => {
        stat(resolve("../players.json"), (err, stats) => {
            res.json(err ? 0 : stats.mtimeMs);
        });
    });
    app.get("/timesync", (_, res) => {
        res.json(Date.now());
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

    await applyHub(server);

    if (!isDevelopment) await applyResults(app);

    server.listen(21822, "localhost", () => {
        console.log("SERVER_STARTED_LISTENING");
    });
};

run();
