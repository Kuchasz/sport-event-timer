import cors from "cors";
import express from "express";
import { apply as applyHub } from "@set/hub";
import { createServer } from "http";
import { readFile, stat } from "fs";
import { resolve } from "path";
// import { apply as applyResults } from "@set/results";

const requireModule = (path: string) => resolve(__dirname + `/../node_modules/${path}`);

const app = express();
app.use(cors());
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

    await applyHub(server);
    // await applyResults(app);

    server.listen(21822, "localhost", () => {
        console.log("SERVER_STARTED_LISTENING");
    });
};

run();
